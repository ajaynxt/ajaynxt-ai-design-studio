/**
 * AJAYNXT AI Design Studio — Provider Registry & Health Manager
 * Tracks operational readiness, quotas, licensing, and explicit routing.
 */

const config = require('../config');

// Provider State Enum
const ProviderState = {
  CONFIGURED: 'CONFIGURED',
  UNCONFIGURED: 'UNCONFIGURED',
  UNAVAILABLE: 'UNAVAILABLE',
  QUOTA_EXHAUSTED: 'QUOTA_EXHAUSTED'
};

class ProviderRegistry {
  constructor() {
    this.statusMap = new Map();
    this.initializeStatus();
  }

  initializeStatus() {
    // 1. Gemini API (Prompt refinement & multimodal image understanding)
    const hasGemini = Boolean(config.providers.gemini.apiKey && config.providers.gemini.apiKey.trim().length > 10);
    this.statusMap.set('gemini', {
      id: 'gemini',
      name: 'Google Gemini API (1.5 Flash / 1.5 Pro)',
      category: 'llm_and_vision',
      state: hasGemini ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED,
      hasFreeTier: true,
      freeTierDetails: '15 RPM, 1M TPM, 1,500 RPD free on Google AI Studio',
      costStructure: '$0.075 / 1M input tokens, $0.30 / 1M output tokens',
      license: 'Google Cloud Terms of Service',
      lastCheck: new Date().toISOString()
    });

    // 2. NVIDIA NIM (Image Generation)
    const hasNvidia = Boolean(config.providers.nvidiaNim.apiKey && config.providers.nvidiaNim.apiKey.trim().length > 10);
    this.statusMap.set('nvidia_nim', {
      id: 'nvidia_nim',
      name: 'NVIDIA NIM Microservices (SDXL-Turbo / FLUX)',
      category: 'image_generation',
      state: hasNvidia ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED,
      hasFreeTier: true,
      freeTierDetails: '1,000 free inference credits on NVIDIA NGC Developer account',
      costStructure: '~$0.002 to $0.005 per image generation call',
      license: 'NVIDIA Community & Commercial API License',
      lastCheck: new Date().toISOString()
    });

    // 3. Google Imagen 3 (Image Generation)
    const hasImagen = Boolean(config.providers.googleImagen.apiKey && config.providers.googleImagen.apiKey.trim().length > 10);
    this.statusMap.set('google_imagen', {
      id: 'google_imagen',
      name: 'Google Imagen 3 (Vertex AI / Gemini Vision)',
      category: 'image_generation',
      state: hasImagen ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED,
      hasFreeTier: false,
      freeTierDetails: 'No permanent free tier; billed per generated image',
      costStructure: '$0.030 per standard 1024x1024 image',
      license: 'Google Cloud Platform Terms',
      lastCheck: new Date().toISOString()
    });

    // 4. Photoroom API (Background Removal)
    const hasPhotoroom = Boolean(config.providers.photoroom.apiKey && config.providers.photoroom.apiKey.trim().length > 10);
    this.statusMap.set('photoroom', {
      id: 'photoroom',
      name: 'Photoroom Studio API',
      category: 'background_removal',
      state: hasPhotoroom ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED,
      hasFreeTier: false,
      freeTierDetails: 'Sandbox/test calls only; production requires commercial API credits',
      costStructure: '$0.050 to $0.080 per high-resolution cutout',
      license: 'Photoroom Commercial API License',
      lastCheck: new Date().toISOString()
    });

    // 5. remove.bg (Alternative Background Removal)
    const hasRemoveBg = Boolean(config.providers.removeBg.apiKey && config.providers.removeBg.apiKey.trim().length > 10);
    this.statusMap.set('remove_bg', {
      id: 'remove_bg',
      name: 'remove.bg API (Kaleido / Canva)',
      category: 'background_removal',
      state: hasRemoveBg ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED,
      hasFreeTier: true,
      freeTierDetails: '1 free preview credit / 50 preview API calls per month',
      costStructure: '$0.120 to $0.200 per full-resolution image',
      license: 'Kaleido AI Terms of Service',
      lastCheck: new Date().toISOString()
    });

    // 6. Google Cloud Vision OCR
    const hasVision = Boolean(config.providers.cloudVision.apiKey && config.providers.cloudVision.apiKey.trim().length > 10);
    this.statusMap.set('cloud_vision', {
      id: 'cloud_vision',
      name: 'Google Cloud Vision API (OCR Text & Label Detection)',
      category: 'ocr',
      state: hasVision ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED,
      hasFreeTier: true,
      freeTierDetails: 'First 1,000 text detection requests per month are 100% free',
      costStructure: '$1.50 per 1,000 units above free tier',
      license: 'Google Cloud Platform Terms',
      lastCheck: new Date().toISOString()
    });

    // 7. Hugging Face Inference
    const hasHF = Boolean(config.providers.huggingFace.apiKey && config.providers.huggingFace.apiKey.trim().length > 10);
    this.statusMap.set('hugging_face', {
      id: 'hugging_face',
      name: 'Hugging Face Serverless Inference (FLUX.1-schnell / SDXL)',
      category: 'experimental_generation',
      state: hasHF ? ProviderState.CONFIGURED : ProviderState.UNCONFIGURED,
      hasFreeTier: true,
      freeTierDetails: 'Rate-limited community tier with user API token',
      costStructure: 'Free serverless inference subject to hourly rate limits',
      license: 'OpenRAIL / Apache 2.0 based on model weights',
      lastCheck: new Date().toISOString()
    });
  }

  getProvider(providerId) {
    return this.statusMap.get(providerId);
  }

  getAllStatuses() {
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
   * Disallows silent fallback to a paid provider unless explicitly approved by user.
   */
  resolveProvider(requestedProviderId, category, allowFallback = false) {
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

    // If requested provider is not configured or exhausted, check if fallback is allowed
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
