/**
 * AJAYNXT AI Design Studio — Service Contracts & Typed Interfaces
 * Phase 1 Local Mock & Typed Foundation for Phase 2 Cloud Integration
 */

// 1. Authentication Service Contract
export const authService = {
  currentUser: null,
  listeners: [],

  init() {
    try {
      const stored = localStorage.getItem('ajaynxt_user_session');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Local session read error:', e);
    }
  },

  async signInWithGoogle() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          uid: 'usr_' + Date.now().toString(36),
          displayName: 'Creative Director',
          email: 'designer@diamondbakery.in',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
          provider: 'google.com',
          isAnonymous: false,
          role: 'Pro Designer'
        };
        this.currentUser = mockUser;
        localStorage.setItem('ajaynxt_user_session', JSON.stringify(mockUser));
        this.notifyListeners();
        resolve(mockUser);
      }, 400);
    });
  },

  async signInWithEmail(email, password) {
    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }
    const mockUser = {
      uid: 'usr_' + Date.now().toString(36),
      displayName: email.split('@')[0],
      email: email,
      photoURL: null,
      provider: 'password',
      isAnonymous: false,
      role: 'Member'
    };
    this.currentUser = mockUser;
    localStorage.setItem('ajaynxt_user_session', JSON.stringify(mockUser));
    this.notifyListeners();
    return mockUser;
  },

  async signUpWithEmail(email, password, extra = {}) {
    const mockUser = {
      uid: 'usr_' + Date.now().toString(36),
      displayName: extra.displayName || email.split('@')[0],
      email: email,
      photoURL: null,
      provider: 'password',
      isAnonymous: false,
      role: 'Pro Designer (7-Day Trial)'
    };
    this.currentUser = mockUser;
    localStorage.setItem('ajaynxt_user_session', JSON.stringify(mockUser));
    this.notifyListeners();
    return mockUser;
  },

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem('ajaynxt_user_session');
    this.notifyListeners();
    return true;
  },

  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  },

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentUser));
  }
};

// 2. AI Design Studio Service Contract
export const aiStudioService = {
  async refinePrompt(naturalText, context = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
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

        resolve({
          enhancedPrompt: `A high-end professional commercial graphic design for ${context.brand || 'Diamond Bakery'}. Featuring ${naturalText.trim()}. Styled with ${style}, ${typography}, and exquisite color harmony.`,
          suggestedStyle: style,
          recommendedPalette: colorPalette,
          typography: typography,
          layoutNotes: layout
        });
      }, 350);
    });
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
        studioEngine: 'AJAYNXT-v1.0-Phase1'
      }
    };
  }
};

// 3. Project Storage Service Contract
export const storageService = {
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
      return { success: true, key };
    } catch (e) {
      console.error('Save failed:', e);
      return { success: false, error: e.message };
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

  loadProjectLocally(projectId) {
    try {
      const data = localStorage.getItem(`ajaynxt_project_${projectId}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  async listProjects() {
    try {
      const raw = localStorage.getItem('ajaynxt_studio_projects');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
};

// 4. Professional AI Background Removal Service Contract
export const bgRemovalService = {
  /**
   * Provider Evaluation & Comparison Data
   * Prepared for Phase 2 Firebase Cloud Functions selection
   */
  providers: [
    {
      id: 'remove_bg',
      name: 'remove.bg API',
      description: 'Specialized deep learning model for foreground segmentation and fine hair detection.',
      strengths: ['Exceptional human hair and fur edge matting', 'Fast response time (< 2.5s)', 'Automatic shadow preservation option'],
      limitations: ['Higher cost per megapixel', 'Occasional edge clipping on translucent glassware or white on white food products'],
      costEstimate: '₹8 - ₹15 per full-res image (Volume pricing)',
      maxResolution: '25 Megapixels (up to 5000 × 5000 px)',
      serverEndpoint: '/api/v1/bg-remove/removebg (Phase 2 Cloud Function)'
    },
    {
      id: 'adobe_photoshop',
      name: 'Adobe Photoshop API (Photoshop Sensei)',
      description: 'Enterprise grade generative AI and Sensei cutout engine with fine edge refinement.',
      strengths: ['Flawless preservation of complex bakery, pastry, and cookie packaging edges', 'Multi-channel alpha mask output', 'Smart edge halo decontamination'],
      limitations: ['Slightly higher latency (3-5s)', 'Requires Adobe Developer Console enterprise credentials'],
      costEstimate: 'Included in Adobe Creative Cloud developer token pack',
      maxResolution: 'Full native dimensions up to 8000 × 8000 px',
      serverEndpoint: '/api/v1/bg-remove/adobe (Phase 2 Cloud Function)'
    },
    {
      id: 'photoroom',
      name: 'Photoroom Studio API',
      description: 'Dedicated e-commerce product cutout and lighting engine.',
      strengths: ['Great with food packaging, tins, bottles, and reflections', 'Built-in studio shadow synthesis'],
      limitations: ['Can over-smooth fluffy pastry textures if confidence threshold is too high'],
      costEstimate: '₹4 - ₹8 per image',
      maxResolution: 'Full 4K output',
      serverEndpoint: '/api/v1/bg-remove/photoroom (Phase 2 Cloud Function)'
    }
  ],

  /**
   * Comprehensive Test Dataset Specification
   */
  testSet: [
    { category: 'Human Portraits', focus: 'Fine flyaway hair strands, semi-transparent edges, neck contour' },
    { category: 'Bakery & Cookies', focus: 'Melodi cookies, crumb texture, cream swirls, crust detail without white halos' },
    { category: 'Product Packaging', focus: 'Circular 6-inch tin edges, reflective metal rims, crisp corner alignment' },
    { category: 'White on White', focus: 'White vanilla frosting or ivory packaging on pure white background' },
    { category: 'Complex Scenes', focus: 'Food items placed on patterned tablecloths, kitchen marble counters' }
  ],

  /**
   * Client-side edge & chroma-aware matting algorithm for instant local preview.
   * Processes image on an HTML5 canvas and computes true RGBA alpha channel.
   */
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

      // Sample border pixels to detect dominant background color
      let rSum = 0, gSum = 0, bSum = 0, sampleCount = 0;
      const step = Math.max(1, Math.floor(Math.min(width, height) / 50));

      for (let x = 0; x < width; x += step) {
        // top edge
        let idx = (x * 4);
        rSum += data[idx]; gSum += data[idx+1]; bSum += data[idx+2]; sampleCount++;
        // bottom edge
        idx = (((height - 1) * width + x) * 4);
        rSum += data[idx]; gSum += data[idx+1]; bSum += data[idx+2]; sampleCount++;
      }
      for (let y = 0; y < height; y += step) {
        // left edge
        let idx = ((y * width) * 4);
        rSum += data[idx]; gSum += data[idx+1]; bSum += data[idx+2]; sampleCount++;
        // right edge
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

        // Euclidean color distance from background
        const dist = Math.sqrt(
          (r - bgR) * (r - bgR) * 0.299 +
          (g - bgG) * (g - bgG) * 0.587 +
          (b - bgB) * (b - bgB) * 0.114
        );

        if (dist < tolerance) {
          data[i + 3] = 0; // completely transparent
        } else if (dist < tolerance + feather) {
          // Smooth alpha transition to prevent jagged edges & white halos
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

// Global StudioServices namespace for seamless cross-module access
window.StudioServices = {
  auth: authService,
  ai: aiStudioService,
  storage: storageService,
  bgRemoval: bgRemovalService
};
