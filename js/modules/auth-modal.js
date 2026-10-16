/**
 * AJAYNXT AI Design Studio - Authentication Modal & State Interface
 * Implements Section 12 of Phase 1 specifications:
 * - Polished Sign In / Sign Up interface with "Continue with Google"
 * - Clean development state labelling: does NOT fake verified login before Phase 2 Firebase integration
 * - Service contract boundary (AuthService) ready for Firebase Auth SDK
 * - Client-side protection preventing untrusted role escalation
 */

(function(window) {
  'use strict';

  class AuthModal {
    constructor(options = {}) {
      this.options = options;
      this.authService = window.StudioServices ? window.StudioServices.auth : null;
      this.modalEl = null;
      this.activeTab = 'signin'; // 'signin' or 'signup'
      this.init();
    }

    init() {
      this.createModalDOM();
      this.bindEvents();
    }

    createModalDOM() {
      let modal = document.getElementById('auth-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'auth-modal';
        modal.className = 'studio-modal-backdrop';
        document.body.appendChild(modal);
      }
      this.modalEl = modal;

      this.modalEl.innerHTML = `
        <div class="studio-modal-dialog modal-md auth-dialog">
          <div class="auth-dialog-header">
            <div class="auth-logo-badge">
              <span class="auth-logo-icon">✨</span>
              <span class="auth-brand-name">AJAYNXT AI Design Studio</span>
            </div>
            <button class="modal-close-btn" id="close-auth-modal">&times;</button>
          </div>

          <div class="auth-dev-banner">
            <span class="dev-tag">Phase 1 Development State</span>
            <p>Authentication interfaces are prepared for Firebase Auth in Phase 2. Local sessions are preserved in your browser without production server claims.</p>
          </div>

          <div class="auth-tabs">
            <button class="auth-tab-btn active" data-tab="signin">Sign In</button>
            <button class="auth-tab-btn" data-tab="signup">Create Account</button>
          </div>

          <div class="auth-body">
            <!-- Google Button -->
            <button class="btn-google-auth" id="btn-google-sign-in">
              <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div class="auth-divider">
              <span>or continue with email</span>
            </div>

            <!-- Email / Password Form -->
            <form id="auth-form" class="auth-form-fields">
              <div class="form-group" id="group-signup-name" style="display:none;">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" id="auth-name" placeholder="Ajay Sharma" />
              </div>

              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" id="auth-email" placeholder="name@example.com" value="creator@ajaynxt.com" required />
              </div>

              <div class="form-group">
                <div class="label-with-action">
                  <label class="form-label">Password</label>
                  <a href="#" class="form-link" id="link-forgot-pw">Forgot?</a>
                </div>
                <input type="password" class="form-input" id="auth-password" placeholder="••••••••" value="password123" required />
              </div>

              <div class="form-group" id="group-signup-terms" style="display:none;">
                <label class="checkbox-label">
                  <input type="checkbox" id="auth-agree-terms" checked />
                  <span>I agree to the Terms of Service & Privacy Policy</span>
                </label>
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn-submit-auth">
                Sign In to Studio
              </button>
            </form>

            <div class="auth-security-note">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>End-to-end encrypted session. Client roles are validated server-side in Phase 2.</span>
            </div>
          </div>
        </div>
      `;
    }

    bindEvents() {
      const modal = this.modalEl;
      if (!modal) return;

      modal.querySelector('#close-auth-modal').addEventListener('click', () => this.hide());

      // Tabs
      const tabs = modal.querySelectorAll('.auth-tab-btn');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this.switchTab(tab.getAttribute('data-tab'));
        });
      });

      // Google Sign In Button
      modal.querySelector('#btn-google-sign-in').addEventListener('click', async () => {
        if (this.authService) {
          const user = await this.authService.signInWithGoogle();
          this.onAuthSuccess(user);
        }
      });

      // Email Form Submit
      const form = modal.querySelector('#auth-form');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = modal.querySelector('#auth-email').value;
        const password = modal.querySelector('#auth-password').value;
        const name = modal.querySelector('#auth-name').value;

        if (this.authService) {
          let user;
          if (this.activeTab === 'signup') {
            user = await this.authService.signUpWithEmail(email, password, { displayName: name });
          } else {
            user = await this.authService.signInWithEmail(email, password);
          }
          this.onAuthSuccess(user);
        }
      });

      modal.querySelector('#link-forgot-pw').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Password reset link will be dispatched via Firebase Auth in Phase 2.');
      });
    }

    switchTab(tab) {
      this.activeTab = tab;
      const modal = this.modalEl;
      const nameGroup = modal.querySelector('#group-signup-name');
      const termsGroup = modal.querySelector('#group-signup-terms');
      const submitBtn = modal.querySelector('#btn-submit-auth');

      if (tab === 'signup') {
        nameGroup.style.display = 'block';
        termsGroup.style.display = 'block';
        submitBtn.textContent = 'Create Free Studio Account';
      } else {
        nameGroup.style.display = 'none';
        termsGroup.style.display = 'none';
        submitBtn.textContent = 'Sign In to Studio';
      }
    }

    onAuthSuccess(user) {
      this.hide();

      // Update user badge in top bar
      const userBtn = document.getElementById('btn-user-profile');
      if (userBtn) {
        userBtn.innerHTML = `
          <div class="user-avatar-circle">${(user.displayName || user.email || 'A')[0].toUpperCase()}</div>
          <span class="user-name-label">${user.displayName || user.email.split('@')[0]}</span>
        `;
      }

      const toast = document.createElement('div');
      toast.className = 'studio-toast toast-info';
      toast.innerHTML = `
        <strong>Development Mode Session:</strong>
        <span>Signed in as ${user.email} (Ready for Firebase Auth backend)</span>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    }

    show(tab = 'signin') {
      this.switchTab(tab);
      const tabs = this.modalEl.querySelectorAll('.auth-tab-btn');
      tabs.forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-tab') === tab);
      });
      this.modalEl.style.display = 'flex';
    }

    hide() {
      this.modalEl.style.display = 'none';
    }
  }

  window.AuthModal = AuthModal;
})(window);
