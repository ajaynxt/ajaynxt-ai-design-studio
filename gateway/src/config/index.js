/**
 * AJAYNXT AI Design Studio — Low-Cost Gateway Configuration
 * Enforces ₹300 INR total monthly ceiling, ₹200 INR AI sub-budget,
 * Master & granular Kill Switches, and current official model IDs.
 */

require('dotenv').config();

const USD_TO_INR_DEFAULT = 84.00;
const MONTHLY_BUDGET_INR = parseFloat(process.env.MONTHLY_BUDGET_INR || '300.00');
const AI_SUB_BUDGET_INR = parseFloat(process.env.AI_SUB_BUDGET_INR || '200.00');
const SAFETY_BUFFER_INR = MONTHLY_BUDGET_INR - AI_SUB_BUDGET_INR; // ₹100 reserved for hosting, storage, taxes

module.exports = {
  port: process.env.PORT || 8080,
  env: process.env.NODE_ENV || 'development',
  projectId: process.env.FIREBASE_PROJECT_ID || 'ajaynxt-ai-design-studio',

  // Currency & Budget Ceiling Controls (INR as primary source of truth)
  currency: {
    baseCurrency: 'INR',
    usdToInrRate: parseFloat(process.env.USD_TO_INR_RATE || String(USD_TO_INR_DEFAULT)),
    monthlyBudgetINR: MONTHLY_BUDGET_INR,
    aiSubBudgetINR: AI_SUB_BUDGET_INR,
    safetyBufferINR: SAFETY_BUFFER_INR,
    // USD equivalents for API calculations
    monthlyBudgetUSD: parseFloat((MONTHLY_BUDGET_INR / USD_TO_INR_DEFAULT).toFixed(2)),
    aiSubBudgetUSD: parseFloat((AI_SUB_BUDGET_INR / USD_TO_INR_DEFAULT).toFixed(2)),
    safetyBufferUSD: parseFloat((SAFETY_BUFFER_INR / USD_TO_INR_DEFAULT).toFixed(2)),
    warningThresholdPercent: 80,
    enforceHardStop: true
  },

  // Emergency Master & Granular Kill Switches
  // In development, ALL paid operations are strictly disabled by default.
  killSwitches: {
    masterPaidOpsEnabled: process.env.ENABLE_PAID_AI_OPS === 'true', // DEFAULT: FALSE
    providers: {
      gemini: true,          // Free tier eligible (15 RPM / 1,500 RPD)
      cloudVision: true,     // Free tier eligible (First 1,000 units/mo)
      nvidiaNim: false,      // Disabled by default until explicit approval
      geminiImage: false,    // Paid - Disabled by default
      photoroom: false,      // Paid - Disabled by default
      removeBg: false,       // Paid - Disabled by default
      huggingFace: false     // Disabled by default
    },
    operations: {
      prompt_refinement: true,
      ocr: true,
      image_generation: false, // Paid - Disabled by default
      background_removal: false // Paid - Disabled by default
    }
  },

  // Provider Adapters & Pricing Definitions (Current Verified 2025/2026 Models)
  providers: {
    // 1. Google Gemini 2.0 Flash (Prompt Refinement & Multimodal Understanding)
    // Ref: https://ai.google.dev/pricing (Verified Oct 2026)
    // Free Tier: 15 RPM, 1M TPM, 1,500 RPD free on Google AI Studio
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      fallbackModel: 'gemini-2.0-flash-lite',
      costPer1kTokensIn: 0.00010, // $0.10 per 1M input tokens
      costPer1kTokensOut: 0.00040, // $0.40 per 1M output tokens
      hasFreeTier: true,
      freeTierQuota: '15 RPM / 1,500 Requests/Day free on Google AI Studio'
    },

    // 2. Gemini Multimodal Image Generation (Paid - Disabled by Default)
    // Ref: Google GenAI native multimodal generation (Nano Banana / Gemini 2.0 Flash image)
    geminiImage: {
      apiKey: process.env.GEMINI_API_KEY || '',
      model: process.env.GEMINI_IMAGE_MODEL || 'gemini-2.0-flash',
      isPaid: true,
      // Dynamic resolution-based pricing
      resolutionPricingUSD: {
        '512x512': 0.015,
        '1024x1024': 0.030,
        '2048x2048': 0.060
      }
    },

    // 3. NVIDIA NIM Microservices (SDXL-Turbo / FLUX.1)
    // Ref: https://build.nvidia.com (1,000 free developer credits)
    nvidiaNim: {
      apiKey: process.env.NVIDIA_NIM_API_KEY || '',
      endpoint: process.env.NVIDIA_NIM_ENDPOINT || 'https://integrate.api.nvidia.com/v1',
      model: 'stabilityai/stable-diffusion-xl-turbo',
      costPerCall: 0.002,
      hasFreeTier: true,
      freeTierQuota: '1,000 developer account credits'
    },

    // 4. Photoroom Studio API (Background Removal)
    // Ref: https://www.photoroom.com/api/pricing ($20/mo Basic = ~$0.02/call, Plus = $0.10/call)
    photoroom: {
      apiKey: process.env.PHOTOROOM_API_KEY || '',
      endpoint: 'https://sdk.photoroom.com/v1/segment',
      isPaid: true,
      costPerCall: 0.050,
      monthlyMinSubscriptionUSD: 20.00 // $20/mo minimum commitment
    },

    // 5. remove.bg (Kaleido API)
    // Ref: https://www.remove.bg/pricing ($0.12 - $0.20 / full res image)
    removeBg: {
      apiKey: process.env.REMOVE_BG_API_KEY || '',
      endpoint: 'https://api.remove.bg/v1.0/removebg',
      isPaid: true,
      costPerCall: 0.120
    },

    // 6. Google Cloud Vision API (OCR)
    // Ref: https://cloud.google.com/vision/pricing (First 1,000 units free/mo)
    cloudVision: {
      apiKey: process.env.GCP_VISION_KEY || process.env.GEMINI_API_KEY || '',
      costPer1kUnits: 1.50, // $1.50 per 1,000 units ($0.0015 / request)
      hasFreeTier: true,
      freeTierQuota: '1,000 units/month 100% free'
    },

    // 7. Hugging Face Serverless Inference (FLUX.1-schnell / SDXL)
    huggingFace: {
      apiKey: process.env.HF_TOKEN || '',
      model: 'black-forest-labs/FLUX.1-schnell',
      endpoint: 'https://api-inference.huggingface.co/models/'
    }
  },

  // Per-user daily & monthly limits to prevent free-trial abuse
  userQuotas: {
    anonymousDev: {
      dailyPaidOps: 0, // 0 paid operations allowed anonymously
      dailyFreeOps: 20
    },
    authenticatedTrial: {
      dailyPaidOps: 2, // Maximum 2 paid operations/day during approved trial
      dailyFreeOps: 50,
      monthlyPaidLimitINR: 50.00 // Max ₹50 per user during trial
    }
  }
};
