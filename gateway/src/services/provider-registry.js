/**
 * AJAYNXT AI Design Studio — Low-Cost Provider Registry & Health Manager
 * Tracks operational readiness, verified models, quotas, licensing, and Kill Switches.
 */

const config = require('../config');

// Provider State Enum
const ProviderState = {
  CONFIGURED: 'CONFIGURED',
  UNCONFIGURED: 'UNCONFIGURED',
  DISABLED_BY_ADMIN: 'DISABLED_BY_ADMIN',
  UNAVAILABLE: 'UNAVAILABLE',
  QUOTA_EXHAUSTED: 'QUOTA_EXHAUSTED'
};

class ProviderRegistry {
  constructor() {
    this.statusMap = new Map();
    this.initializeStatus();
  }

  initializeStatus() {
    const budget = require('./budget');

    // 1. Google Gemini 2.0 Flash (Prompt Refinement & Vision)
    const hasGemini = Boolean(config.providers.gemini.apiKey && config.providers.gemini.apiKey.trim().length > 10);
    this.statusMap.set('gemini', {
      id: 'gemini',
      name: 'Google Gemini 2.0 Flash (Official Text & Vision)',
      category: 'llm_and_vision',
      modelId: config.providers.gemini.model,
      state: !budget.providerSwitches.gemini
        ? ProviderState.DISABLED_BY_ADMIN
        : (hasGemini ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED),
      hasFreeTier: true,
      freeTierDetails: '15 RPM, 1M TPM, 1,500 RPD free on Google AI Studio',
      costStructure: '$0.10 / 1M input tokens, $0.40 / 1M output tokens',
      license: 'Google Cloud Platform Terms of Service',
      pricingSourceUrl: 'https://ai.google.dev/pricing',
      verifiedDate: '2026-10-16',
      lastCheck: new Date().toISOString()
    });

    // 2. NVIDIA NIM (Image Generation - Developer Trial)
    const hasNvidia = Boolean(config.providers.nvidiaNim.apiKey && config.providers.nvidiaNim.apiKey.trim().length > 10);
    this.statusMap.set('nvidia_nim', {
      id: 'nvidia_nim',
      name: 'NVIDIA NIM Microservices (SDXL-Turbo / FLUX.1)',
      category: 'image_generation',
      modelId: config.providers.nvidiaNim.model,
      state: !budget.providerSwitches.nvidiaNim
        ? ProviderState.DISABLED_BY_ADMIN
        : (hasNvidia ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED),
      hasFreeTier: true,
      freeTierDetails: '1,000 free developer account inference credits on NVIDIA NGC',
      costStructure: '~$0.002 to $0.005 per image generation call',
      license: 'NVIDIA Community & Commercial API License',
      pricingSourceUrl: 'https://build.nvidia.com',
      verifiedDate: '2026-10-16',
      lastCheck: new Date().toISOString()
    });

    // 3. Gemini Native Image Generation (Paid - Disabled by Default)
    const hasGeminiImage = Boolean(config.providers.geminiImage.apiKey && config.providers.geminiImage.apiKey.trim().length > 10);
    this.statusMap.set('gemini_image', {
      id: 'gemini_image',
      name: 'Gemini Multimodal Image Generation (Nano Banana / 2.0 Flash Image)',
      category: 'image_generation',
      modelId: config.providers.geminiImage.model,
      state: !budget.providerSwitches.geminiImage || !budget.masterPaidOpsEnabled
        ? ProviderState.DISABLED_BY_ADMIN
        : (hasGeminiImage ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED),
      hasFreeTier: false,
      freeTierDetails: 'No permanent free tier; billed dynamically by resolution',
      costStructure: '$0.015 (512px) | $0.030 (1024px) | $0.060 (2048px)',
      license: 'Google Cloud Platform Terms',
      pricingSourceUrl: 'https://ai.google.dev/pricing',
      verifiedDate: '2026-10-16',
      lastCheck: new Date().toISOString()
    });

    // 4. Photoroom Studio API (Background Removal - Paid)
    const hasPhotoroom = Boolean(config.providers.photoroom.apiKey && config.providers.photoroom.apiKey.trim().length > 10);
    this.statusMap.set('photoroom', {
      id: 'photoroom',
      name: 'Photoroom Studio API',
      category: 'background_removal',
      state: !budget.providerSwitches.photoroom || !budget.masterPaidOpsEnabled
        ? ProviderState.DISABLED_BY_ADMIN
        : (hasPhotoroom ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED),
      hasFreeTier: false,
      freeTierDetails: 'Sandbox mode has 1,000 free test calls (watermarked). Production requires $20/mo minimum subscription.',
      costStructure: 'Basic Plan: $20.00/month (~$0.02/image) | Plus: $100.00/month (~$0.10/image)',
      license: 'Photoroom Commercial API License',
      pricingSourceUrl: 'https://www.photoroom.com/api/pricing',
      verifiedDate: '2026-10-16',
      lastCheck: new Date().toISOString()
    });

    // 5. remove.bg API (Alternative Background Removal - Paid)
    const hasRemoveBg = Boolean(config.providers.removeBg.apiKey && config.providers.removeBg.apiKey.trim().length > 10);
    this.statusMap.set('remove_bg', {
      id: 'remove_bg',
      name: 'remove.bg API (Kaleido / Canva)',
      category: 'background_removal',
      state: !budget.providerSwitches.removeBg || !budget.masterPaidOpsEnabled
        ? ProviderState.DISABLED_BY_ADMIN
        : (hasRemoveBg ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED),
      hasFreeTier: true,
      freeTierDetails: '1 free preview credit / 50 preview API calls per month',
      costStructure: '$0.120 to $0.200 per full-resolution image',
      license: 'Kaleido AI Terms of Service',
      pricingSourceUrl: 'https://www.remove.bg/pricing',
      verifiedDate: '2026-10-16',
      lastCheck: new Date().toISOString()
    });

    // 6. Google Cloud Vision API (OCR)
    const hasVision = Boolean(config.providers.cloudVision.apiKey && config.providers.cloudVision.apiKey.trim().length > 10);
    this.statusMap.set('cloud_vision', {
      id: 'cloud_vision',
      name: 'Google Cloud Vision API (OCR Text & Label Detection)',
      category: 'ocr',
      state: !budget.providerSwitches.cloudVision
        ? ProviderState.DISABLED_BY_ADMIN
        : (hasVision ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED),
      hasFreeTier: true,
      freeTierDetails: 'First 1,000 text detection units per month are 100% free',
      costStructure: '$1.50 per 1,000 units ($0.0015/request) above free tier',
      license: 'Google Cloud Platform Terms',
      pricingSourceUrl: 'https://cloud.google.com/vision/pricing',
      verifiedDate: '2026-10-16',
      lastCheck: new Date().toISOString()
    });

    // 7. Hugging Face Serverless Inference
    const hasHF = Boolean(config.providers.huggingFace.apiKey && config.providers.huggingFace.apiKey.trim().length > 10);
    this.statusMap.set('hugging_face', {
      id: 'hugging_face',
      name: 'Hugging Face Serverless Inference (FLUX.1-schnell / SDXL)',
      category: 'experimental_generation',
      modelId: config.providers.huggingFace.model,
      state: !budget.providerSwitches.huggingFace
        ? ProviderState.DISABLED_BY_ADMIN
        : (hasHF ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED),
      hasFreeTier: true,
      freeTierDetails: 'Rate-limited community tier with user API token',
      costStructure: 'Free serverless inference subject to hourly rate limits',
      license: 'OpenRAIL / Apache 2.0 based on model weights',
      pricingSourceUrl: 'https://huggingface.co/docs/api-inference',
      verifiedDate: '2026-10-16',
      lastCheck: new Date().toISOString()
    });
  }

  getProvider(providerId) {
    this.initializeStatus();
    return this.statusMap.get(providerId);
  }

  getAllStatuses() {
    this.initializeStatus();
    return Array.from(this.statusMap.values());
  }

  setQuotaExhausted(providerId) {
    const p = this.statusMap.get(providerId);
    if (p) {
      p.state = ProviderState.QUOTA_EXHAUSTED;
      p.lastCheck = new Date().toISOString();
    }
  }

  setUnavailable(providerId, reason) {
    const p = this.statusMap.get(providerId);
    if (p) {
      p.state = ProviderState.UNAVAILABLE;
      p.unavailableReason = reason;
      p.lastCheck = new Date().toISOString();
    }
  }

  /**
   * Enforces explicit provider routing.
   * Disallows silent fallback to a paid provider.
   */
  resolveProvider(requestedProviderId, category, allowFallback = false) {
    this.initializeStatus();
    const requested = this.statusMap.get(requestedProviderId);

    if (!requested) {
      throw new Error(`Requested provider "${requestedProviderId}" is not registered in the gateway.`);
    }

    if (requested.category !== category) {
      throw new Error(`Provider "${requestedProviderId}" does not support operation category "${category}".`);
    }

    if (requested.state === ProviderState.CONFIGURED) {
      return { provider: requested, isFallback: false };
    }

    if (!allowFallback) {
      throw new Error(
        `Provider "${requested.name}" is currently ${requested.state}. ` +
        `Silent fallback is disabled to prevent unexpected costs. ` +
        `Please configure its API key or explicitly select an approved alternative.`
      );
    }

    // Approved fallbacks only within same category
    for (const [id, prov] of this.statusMap.entries()) {
      if (id !== requestedProviderId && prov.category === category && prov.state === ProviderState.CONFIGURED) {
        return { provider: prov, isFallback: true, originalRequested: requestedProviderId };
      }
    }

    throw new Error(`No configured alternative provider found for category "${category}".`);
  }
}

module.exports = new ProviderRegistry();
