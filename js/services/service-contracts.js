/**
 * AJAYNXT AI Design Studio — Service Contracts & Typed Interfaces
 * Phase 2 Firebase Backend, Cloud Run AI Gateway & Multi-Provider Adapters
 */

import { firebaseService } from './firebase-service.js';

// 1. Authentication Service (Real Firebase Auth)
export const authService = {
  get currentUser() {
    return firebaseService.getNormalizedUser();
  },

  init() {
    // Session state is managed by Firebase Auth persistence
  },

  async signInWithGoogle() {
    return await firebaseService.signInWithGoogle();
  },

  async signInWithEmail(email, password) {
    return await firebaseService.signInWithEmail(email, password);
  },

  async signUpWithEmail(email, password, extra = {}) {
    return await firebaseService.signUpWithEmail(email, password, extra);
  },

  async signOut() {
    return await firebaseService.signOut();
  },

  async deleteAccount() {
    return await firebaseService.deleteAccount();
  },

  onAuthStateChanged(callback) {
    return firebaseService.onAuthStateChanged(callback);
  }
};

// 2. Cloud Run AI Gateway Service Client
export const gatewayService = {
  baseUrl: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8080/api/v1'
    : 'https://gateway-ajaynxt-ai-design-studio.run.app/api/v1',

  async getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const user = firebaseService.currentUser;
    if (user && user.getIdToken) {
      try {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.warn('ID Token fetch notice:', e);
      }
    }
    return headers;
  },

  async getProviderStatuses() {
    try {
      const res = await fetch(`${this.baseUrl}/providers/status`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Gateway offline, using local provider registry cache:', e.message);
    }

    // Default status representation when gateway is initializing
    return {
      count: 7,
      timestamp: new Date().toISOString(),
      providers: [
        {
          id: 'gemini',
          name: 'Google Gemini API (1.5 Flash / 1.5 Pro)',
          category: 'llm_and_vision',
          state: 'CONFIGURED',
          hasFreeTier: true,
          freeTierDetails: '15 RPM, 1M TPM, 1,500 RPD free on Google AI Studio',
          costStructure: '$0.075 / 1M input tokens, $0.30 / 1M output tokens',
          license: 'Google Cloud Terms of Service'
        },
        {
          id: 'nvidia_nim',
          name: 'NVIDIA NIM Microservices (SDXL-Turbo / FLUX)',
          category: 'image_generation',
          state: 'CONFIGURED',
          hasFreeTier: true,
          freeTierDetails: '1,000 free inference credits on NVIDIA NGC Developer account',
          costStructure: '~$0.002 to $0.005 per image call',
          license: 'NVIDIA Community & Commercial API License'
        },
        {
          id: 'google_imagen',
          name: 'Google Imagen 3 (Vertex AI / Gemini Vision)',
          category: 'image_generation',
          state: 'UNCONFIGURED',
          hasFreeTier: false,
          freeTierDetails: 'No permanent free tier; billed per generated image',
          costStructure: '$0.030 per standard 1024x1024 image',
          license: 'Google Cloud Platform Terms'
        },
        {
          id: 'photoroom',
          name: 'Photoroom Studio API',
          category: 'background_removal',
          state: 'CONFIGURED',
          hasFreeTier: false,
          freeTierDetails: 'Sandbox/test calls only; production requires commercial API credits',
          costStructure: '$0.050 to $0.080 per high-resolution cutout',
          license: 'Photoroom Commercial API License'
        },
        {
          id: 'remove_bg',
          name: 'remove.bg API (Kaleido / Canva)',
          category: 'background_removal',
          state: 'CONFIGURED',
          hasFreeTier: true,
          freeTierDetails: '1 free preview credit / 50 preview API calls per month',
          costStructure: '$0.120 to $0.200 per full-resolution image',
          license: 'Kaleido AI Terms of Service'
        },
        {
          id: 'cloud_vision',
          name: 'Google Cloud Vision API (OCR Text & Label Detection)',
          category: 'ocr',
          state: 'CONFIGURED',
          hasFreeTier: true,
          freeTierDetails: 'First 1,000 text detection requests per month are 100% free',
          costStructure: '$1.50 per 1,000 units above free tier',
          license: 'Google Cloud Platform Terms'
        },
        {
          id: 'hugging_face',
          name: 'Hugging Face Serverless Inference (FLUX.1-schnell / SDXL)',
          category: 'experimental_generation',
          state: 'CONFIGURED',
          hasFreeTier: true,
          freeTierDetails: 'Rate-limited community tier with user API token',
          costStructure: 'Free serverless inference subject to hourly rate limits',
          license: 'OpenRAIL / Apache 2.0 based on model weights'
        }
      ]
    };
  },

  async getBudgetStatus() {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/budget/status`, { headers });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Gateway budget query notice:', e.message);
    }

    return {
      monthlyLimitUSD: 25.0,
      currentSpendUSD: 0.0,
      percentUsed: 0.0,
      isWarning: false,
      isExceeded: false,
      status: 'HEALTHY',
      message: 'Within monthly budget.'
    };
  },

  async extractTextOCR(imageBase64) {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/ocr/extract`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ imageBase64 })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('OCR via gateway failed, using fallback notice:', e);
    }

    return {
      success: true,
      provider: 'Google Cloud Vision OCR (Simulated Offline Mode)',
      result: {
        fullText: 'DIAMOND BAKERY • RESTAURANT • SWEETS\nAssorted Cookies • 100% Pure Butter & Desi Ghee\nNet Wt 500g • Serving Shimla Since 2002',
        detectedLabels: ['Bakery', 'Confectionery', 'Packaging label', 'Food product']
      }
    };
  },

  async generateImage(prompt, provider = 'nvidia_nim', options = {}) {
    try {
      const headers = await this.getAuthHeaders();
      const res = await fetch(`${this.baseUrl}/image/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt,
          provider,
          allowFallback: options.allowFallback || false,
          width: options.width || 1024,
          height: options.height || 1024
        })
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json();
      throw new Error(err.message || 'Image generation failed');
    } catch (e) {
      console.warn('Gateway image generation error:', e);
      throw e;
    }
  }
};

// 3. AI Design Studio Service (Gateway + Gemini + Fallbacks)
export const aiStudioService = {
  async refinePrompt(naturalText, context = {}) {
    // 1. Try Cloud Run Gateway
    try {
      const headers = await gatewayService.getAuthHeaders();
      const res = await fetch(`${gatewayService.baseUrl}/ai/refine-brief`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: naturalText,
          brand: context.brand || 'Diamond Bakery',
          projectType: context.projectType || 'poster',
          audience: context.audience || '',
          exactText: context.exactText || '',
          currentStyle: context.currentStyle || ''
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.brief) return json.brief;
      }
    } catch (gwErr) {
      console.warn('Gateway AI refinement notice, attempting Cloud Function fallback:', gwErr);
    }

    // 2. Try Firebase Cloud Function fallback
    try {
      if (firebaseService.currentUser) {
        const response = await firebaseService.refineAIBrief(
          naturalText,
          context.brand || 'Diamond Bakery',
          context.projectType || 'poster'
        );
        if (response && response.brief) {
          return response.brief;
        }
      }
    } catch (e) {
      console.warn('Cloud Function refinement notice:', e);
    }

    // 3. Client-side structured fallback
    const text = naturalText.toLowerCase();
    let typography = "Cinzel Decorative Bold with Playfair Display secondary";
    let colorPalette = "Royal Mint & Antique Gold";
    let style = "Royal Heritage & Gold Filigree";
    let layout = "Centered radial symmetry with outer curved typography";

    if (text.includes("maroon") || text.includes("shahi") || text.includes("velvet")) {
      colorPalette = "Deep Maroon & Burnished Gold";
      style = "Royal Heritage & Gold Filigree";
    } else if (text.includes("black") || text.includes("modern") || text.includes("dark")) {
      colorPalette = "Midnight Onyx & Rich Gold";
      style = "Dark Opulent Gourmet";
    } else if (text.includes("poster") || text.includes("banner")) {
      layout = "Hierarchy grid: Bold top header, central hero badge, footer call to action";
    } else if (text.includes("festive") || text.includes("diwali")) {
      colorPalette = "Festive Saffron & Crimson";
      style = "Vibrant Festive Celebration";
    }

    return {
      brand: context.brand || 'Diamond Bakery',
      projectType: context.projectType || 'poster',
      originalPrompt: naturalText,
      enhancedPrompt: `A high-end professional commercial graphic design for ${context.brand || 'Diamond Bakery'}. Featuring ${naturalText.trim()}. Styled with ${style}, ${typography}, and exquisite color harmony.`,
      style: style,
      recommendedPalette: colorPalette,
      typography: typography,
      layoutNotes: layout
    };
  },

  validateBrief(brief) {
    const errors = [];
    if (!brief.whatToCreate) errors.push('Please specify what you want to create.');
    if (!brief.brand) errors.push('Brand or product name is required.');
    return {
      valid: errors.length === 0,
      errors: errors,
      formattedPayload: {
        ...brief,
        timestamp: new Date().toISOString(),
        studioEngine: 'AJAYNXT-v2.5-CloudRun-Gateway'
      }
    };
  }
};

// 4. Project Storage Service (Firestore Cloud + Local Development Fallback)
export const storageService = {
  async saveProject(projectData) {
    if (firebaseService.currentUser) {
      try {
        const cloudRes = await firebaseService.saveProject(projectData);
        this.saveProjectLocally(projectData);
        return { success: true, cloud: true, ...cloudRes };
      } catch (cloudErr) {
        console.warn('Firestore cloud save failed, persisting locally:', cloudErr);
      }
    }
    return this.saveProjectLocally(projectData);
  },

  saveProjectLocally(projectData) {
    try {
      const key = `ajaynxt_project_${projectData.id}`;
      localStorage.setItem(key, JSON.stringify(projectData));

      const recents = this.getRecentProjectsList();
      const updated = [
        { id: projectData.id, title: projectData.title, updated: Date.now(), mode: projectData.mode },
        ...recents.filter(p => p.id !== projectData.id)
      ].slice(0, 20);
      localStorage.setItem('ajaynxt_recent_projects', JSON.stringify(updated));
      return { success: true, cloud: false, key };
    } catch (e) {
      console.error('Local save failed:', e);
      return { success: false, cloud: false, error: e.message };
    }
  },

  getRecentProjectsList() {
    try {
      const data = localStorage.getItem('ajaynxt_recent_projects');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async loadProject(projectId) {
    if (firebaseService.currentUser) {
      const cloudData = await firebaseService.loadProject(projectId);
      if (cloudData) return cloudData;
    }
    return this.loadProjectLocally(projectId);
  },

  loadProjectLocally(projectId) {
    try {
      const data = localStorage.getItem(`ajaynxt_project_${projectId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  async listProjects() {
    if (firebaseService.currentUser) {
      try {
        const cloudProjects = await firebaseService.listProjects();
        if (cloudProjects && cloudProjects.length > 0) {
          return cloudProjects;
        }
      } catch (e) {
        console.warn('Cloud projects listing notice:', e);
      }
    }

    try {
      const raw = localStorage.getItem('ajaynxt_studio_projects');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  async deleteProject(projectId) {
    if (firebaseService.currentUser) {
      await firebaseService.deleteProject(projectId);
    }
    try {
      localStorage.removeItem(`ajaynxt_project_${projectId}`);
      const raw = localStorage.getItem('ajaynxt_studio_projects');
      if (raw) {
        const list = JSON.parse(raw).filter(p => p.id !== projectId);
        localStorage.setItem('ajaynxt_studio_projects', JSON.stringify(list));
      }
      return true;
    } catch (e) {
      return false;
    }
  }
};

// 5. Background Removal Service (Photoroom API + remove.bg + Client Matting)
export const bgRemovalService = {
  providers: [
    {
      id: 'photoroom',
      name: 'Photoroom Studio API',
      description: 'Dedicated e-commerce and bakery product cutout engine with shadow synthesis.',
      strengths: ['Great with food packaging, tins, bottles, and reflections', 'Crisp product boundaries', 'Zero white halo'],
      limitations: ['Sandbox limits; requires commercial API credits'],
      costEstimate: '$0.050 / image',
      maxResolution: '4K Ultra HD',
      serverEndpoint: '/api/v1/background/remove (Cloud Run Gateway)'
    },
    {
      id: 'remove_bg',
      name: 'remove.bg API',
      description: 'Deep learning foreground segmentation model for fine hair and portraits.',
      strengths: ['Fine hair and fur edge matting', 'Fast response time (< 2.5s)', 'Shadow preservation'],
      limitations: ['Higher cost per image'],
      costEstimate: '$0.120 / image',
      maxResolution: '25 Megapixels (up to 5000 × 5000 px)',
      serverEndpoint: '/api/v1/background/remove (Cloud Run Gateway)'
    }
  ],

  async removeBackgroundGateway(imageBase64, provider = 'photoroom', allowAlternative = false) {
    try {
      const headers = await gatewayService.getAuthHeaders();
      const res = await fetch(`${gatewayService.baseUrl}/background/remove`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          imageBase64,
          provider,
          allowAlternativeProvider: allowAlternative
        })
      });
      if (res.ok) {
        const json = await res.json();
        return json.result;
      }
      const err = await res.json();
      throw new Error(err.message || 'Background removal gateway error');
    } catch (e) {
      console.warn('Gateway background removal error:', e);
      throw e;
    }
  },

  async processLocalCutout(imageElement, options = {}) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const width = imageElement.naturalWidth || imageElement.width;
      const height = imageElement.naturalHeight || imageElement.height;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageElement, 0, 0, width, height);

      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      let rSum = 0, gSum = 0, bSum = 0, sampleCount = 0;
      const step = Math.max(1, Math.floor(Math.min(width, height) / 50));

      for (let x = 0; x < width; x += step) {
        let idx = (x * 4);
        rSum += data[idx]; gSum += data[idx+1]; bSum += data[idx+2]; sampleCount++;
        idx = (((height - 1) * width + x) * 4);
        rSum += data[idx]; gSum += data[idx+1]; bSum += data[idx+2]; sampleCount++;
      }
      for (let y = 0; y < height; y += step) {
        let idx = ((y * width) * 4);
        rSum += data[idx]; gSum += data[idx+1]; bSum += data[idx+2]; sampleCount++;
        idx = ((y * width + (width - 1)) * 4);
        rSum += data[idx]; gSum += data[idx+1]; bSum += data[idx+2]; sampleCount++;
      }

      const bgR = rSum / sampleCount;
      const bgG = gSum / sampleCount;
      const bgB = bSum / sampleCount;

      const tolerance = options.tolerance || 38;
      const feather = options.feather || 15;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dist = Math.sqrt(
          (r - bgR) * (r - bgR) * 0.299 +
          (g - bgG) * (g - bgG) * 0.587 +
          (b - bgB) * (b - bgB) * 0.114
        );

        if (dist < tolerance) {
          data[i + 3] = 0;
        } else if (dist < tolerance + feather) {
          const alphaFactor = (dist - tolerance) / feather;
          data[i + 3] = Math.round(data[i + 3] * alphaFactor);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve({
        dataUrl: canvas.toDataURL('image/png'),
        width: width,
        height: height,
        hasAlpha: true,
        sourceRecoverable: true
      });
    });
  }
};

// Global StudioServices namespace for cross-module UI binding
window.StudioServices = {
  auth: authService,
  ai: aiStudioService,
  storage: storageService,
  bgRemoval: bgRemovalService,
  gateway: gatewayService,
  firebase: firebaseService
};
