/**
 * AJAYNXT AI Design Studio — Service Contracts & Typed Interfaces
 * Phase 2 Firebase Backend, Firestore & Google Authentication Integration
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

// 2. AI Design Studio Service Contract (Cloud Functions + Gemini)
export const aiStudioService = {
  async refinePrompt(naturalText, context = {}) {
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
      console.warn('AI Cloud refinement notice:', e);
    }

    // Client-side structured fallback
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
        studioEngine: 'AJAYNXT-v2.0-Phase2-Cloud'
      }
    };
  }
};

// 3. Project Storage Service (Firestore Cloud + Local Development Fallback)
export const storageService = {
  async saveProject(projectData) {
    // 1. If signed in, sync to Firestore Cloud
    if (firebaseService.currentUser) {
      try {
        const cloudRes = await firebaseService.saveProject(projectData);
        // Also cache locally for instant offline opening
        this.saveProjectLocally(projectData);
        return { success: true, cloud: true, ...cloudRes };
      } catch (cloudErr) {
        console.warn('Firestore cloud save failed, persisting locally:', cloudErr);
      }
    }

    // 2. Local fallback
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

// 4. Background Removal Service (Client Matting + Cloud Proxy)
export const bgRemovalService = {
  providers: [
    {
      id: 'remove_bg',
      name: 'remove.bg API',
      description: 'Specialized deep learning model for foreground segmentation and fine hair detection.',
      strengths: ['Exceptional human hair and fur edge matting', 'Fast response time (< 2.5s)', 'Automatic shadow preservation option'],
      limitations: ['Higher cost per megapixel', 'Occasional edge clipping on translucent glassware'],
      costEstimate: '₹8 - ₹15 per full-res image',
      maxResolution: '25 Megapixels (up to 5000 × 5000 px)',
      serverEndpoint: '/api/v1/bg-remove/removebg (Cloud Function)'
    },
    {
      id: 'adobe_photoshop',
      name: 'Adobe Photoshop API (Photoshop Sensei)',
      description: 'Enterprise grade generative AI and Sensei cutout engine with fine edge refinement.',
      strengths: ['Flawless preservation of complex bakery, pastry, and cookie packaging edges', 'Multi-channel alpha mask output', 'Smart edge halo decontamination'],
      limitations: ['Slightly higher latency (3-5s)', 'Requires Adobe Developer Console enterprise credentials'],
      costEstimate: 'Included in Adobe Creative Cloud developer token pack',
      maxResolution: 'Full native dimensions up to 8000 × 8000 px',
      serverEndpoint: '/api/v1/bg-remove/adobe (Cloud Function)'
    },
    {
      id: 'photoroom',
      name: 'Photoroom Studio API',
      description: 'Dedicated e-commerce product cutout and lighting engine.',
      strengths: ['Great with food packaging, tins, bottles, and reflections', 'Built-in studio shadow synthesis'],
      limitations: ['Can over-smooth fluffy pastry textures if confidence threshold is too high'],
      costEstimate: '₹4 - ₹8 per image',
      maxResolution: 'Full 4K output',
      serverEndpoint: '/api/v1/bg-remove/photoroom (Cloud Function)'
    }
  ],

  async removeBackgroundCloud(imageBase64, provider = 'remove_bg') {
    return await firebaseService.removeBackgroundCloud(imageBase64, provider);
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
  firebase: firebaseService
};
