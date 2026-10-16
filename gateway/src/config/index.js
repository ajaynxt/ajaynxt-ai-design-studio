/**
 * AJAYNXT AI Design Studio — Gateway Configuration
 * Defines provider credentials, rate limits, models, and spending controls.
 */

require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8080,
  env: process.env.NODE_ENV || 'development',
  projectId: process.env.FIREBASE_PROJECT_ID || 'ajaynxt-ai-design-studio',

  // Provider Keys (stored in Secret Manager / environment)
  providers: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY || '',
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      fallbackModel: 'gemini-1.5-pro',
      costPer1kTokensIn: 0.000075,
      costPer1kTokensOut: 0.00030
    },
    nvidiaNim: {
      apiKey: process.env.NVIDIA_NIM_API_KEY || '',
      endpoint: process.env.NVIDIA_NIM_ENDPOINT || 'https://integrate.api.nvidia.com/v1',
      model: process.env.NVIDIA_NIM_MODEL || 'stabilityai/stable-diffusion-xl-turbo',
      costPerCall: 0.002
    },
    googleImagen: {
      apiKey: process.env.IMAGEN_API_KEY || process.env.GEMINI_API_KEY || '',
      model: 'imagen-3.0-generate-002',
      costPerImage: 0.030
    },
    photoroom: {
      apiKey: process.env.PHOTOROOM_API_KEY || '',
      endpoint: 'https://sdk.photoroom.com/v1/segment',
      costPerCall: 0.050
    },
    removeBg: {
      apiKey: process.env.REMOVE_BG_API_KEY || '',
      endpoint: 'https://api.remove.bg/v1.0/removebg',
      costPerCall: 0.120
    },
    cloudVision: {
      apiKey: process.env.GCP_VISION_KEY || process.env.GEMINI_API_KEY || '',
      costPer1kUnits: 1.50
    },
    huggingFace: {
      apiKey: process.env.HF_TOKEN || '',
      model: process.env.HF_MODEL || 'black-forest-labs/FLUX.1-schnell',
      endpoint: 'https://api-inference.huggingface.co/models/'
    }
  },

  // Project-level Budget Limits & Alerts
  budget: {
    monthlySpendingLimitUSD: parseFloat(process.env.MONTHLY_BUDGET_LIMIT_USD || '25.00'),
    warningThresholdPercent: 80,
    enforceHardStop: true
  },

  // User Tier Quotas (Operations per calendar month)
  tierQuotas: {
    starter: {
      monthlyAIOperations: 25,
      monthlyBgRemovals: 15,
      export600DpiAllowed: false
    },
    pro_trial: {
      monthlyAIOperations: 50,
      monthlyBgRemovals: 50,
      export600DpiAllowed: true
    },
    pro: {
      monthlyAIOperations: 500,
      monthlyBgRemovals: 500,
      export600DpiAllowed: true
    },
    studio: {
      monthlyAIOperations: 2500,
      monthlyBgRemovals: 2500,
      export600DpiAllowed: true
    }
  }
};
