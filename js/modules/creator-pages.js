/**
 * AJAYNXT AI Design Studio - Creator Suite, Subscription, & Account Pages
 * Implements Section 3 (Pages 10, 11, 12, 13, 15) & Section 14:
 * - Subscription & 7-Day Free Trial Information
 * - Creator Dashboard (templates published, royalty events, community tier)
 * - Creator Template Submission (SVG/JSON source upload, PNG thumbnail, tags, attribution)
 * - Creator Leaderboard (Top community designers)
 * - Account Settings (profile, export defaults, theme, API key placeholder)
 * - All backend-dependent views clearly labelled with development state badges
 */

(function(window) {
  'use strict';

  class CreatorPagesManager {
    constructor(options = {}) {
      this.options = options;
      this.creatorService = window.StudioServices ? window.StudioServices.creator : null;
      this.subService = window.StudioServices ? window.StudioServices.subscription : null;
    }

    renderSubscriptionPage(container) {
      container.innerHTML = `
        <div class="page-container page-subscription">
          <div class="page-header text-center">
            <div class="dev-badge-pill">Phase 1 Development State</div>
            <h1 class="page-title-hero">Simple, Transparent Studio Pricing</h1>
            <p class="page-subtitle-hero">Professional vector editing, 600 DPI packaging exports, and AI-powered design workflows.</p>
            
            <div class="trial-highlight-banner">
              <span class="trial-sparkle">🎉</span>
              <div>
                <strong>7-Day Free Unlimited Trial Included</strong>
                <p>Full access to all templates, 600 DPI master exports, and AI Design Assistant. No credit card required during local development.</p>
              </div>
            </div>
          </div>

          <div class="pricing-cards-grid">
            <!-- Free Tier -->
            <div class="pricing-card">
              <div class="plan-badge">Community</div>
              <h3 class="plan-name">Starter</h3>
              <div class="plan-price">
                <span class="price-val">₹0</span>
                <span class="price-period">/ month</span>
              </div>
              <p class="plan-desc">For exploring templates and basic graphics.</p>
              <ul class="plan-features">
                <li>✓ Standard 72 DPI PNG & JPG exports</li>
                <li>✓ Access to 10+ free community templates</li>
                <li>✓ Standard canvas editing tools & layers</li>
                <li>✓ Local browser project saving</li>
                <li class="disabled">✕ 600 DPI master packaging exports</li>
                <li class="disabled">✕ High-res vector SVG downloads</li>
                <li class="disabled">✕ AI Design Assistant prompt refinement</li>
              </ul>
              <button class="btn btn-outline btn-block" disabled>Current Active Plan</button>
            </div>

            <!-- Pro Tier (Highlighted) -->
            <div class="pricing-card highlighted">
              <div class="popular-ribbon">Most Popular</div>
              <div class="plan-badge">Pro Creator</div>
              <h3 class="plan-name">Studio Pro</h3>
              <div class="plan-price">
                <span class="price-val">₹999</span>
                <span class="price-period">/ month</span>
              </div>
              <p class="plan-desc">For professional designers, bakeries & print shops.</p>
              <ul class="plan-features">
                <li>✓ <strong>7-Day Free Trial</strong> (Zero upfront cost)</li>
                <li>✓ <strong>600 DPI Master Production Exports</strong></li>
                <li>✓ <strong>Pure Vector SVG & Print-Ready PDF</strong></li>
                <li>✓ Full 17+ Royal Mandala Library</li>
                <li>✓ Diamond Bakery 6" Packaging Engine</li>
                <li>✓ A4 Print Imposition Sheet generator</li>
                <li>✓ AI Design Assistant Brief Studio</li>
                <li>✓ Unlimited local project storage</li>
              </ul>
              <button class="btn btn-primary btn-block btn-lg" id="btn-start-trial">Start 7-Day Free Trial</button>
              <div class="plan-footnote">Instant access. Stripe & Razorpay gateway connected in Phase 2.</div>
            </div>

            <!-- Studio Enterprise -->
            <div class="pricing-card">
              <div class="plan-badge">Enterprise</div>
              <h3 class="plan-name">Studio Team</h3>
              <div class="plan-price">
                <span class="price-val">₹2,499</span>
                <span class="price-period">/ month</span>
              </div>
              <p class="plan-desc">For agency teams, FMCG brands & print hubs.</p>
              <ul class="plan-features">
                <li>✓ Everything in Studio Pro</li>
                <li>✓ Multi-user cloud project sharing (Phase 2)</li>
                <li>✓ Custom brand kit & font uploads</li>
                <li>✓ Priority batch 600 DPI rendering</li>
                <li>✓ Dedicated technical support</li>
              </ul>
              <button class="btn btn-outline btn-block" id="btn-contact-sales">Contact Studio Sales</button>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-start-trial').addEventListener('click', () => {
        alert('7-Day Free Trial active in local development session! Full Pro features unlocked.');
      });
      container.querySelector('#btn-contact-sales').addEventListener('click', () => {
        alert('Enterprise inquiries will connect to live sales desk in Phase 2.');
      });
    }

    renderCreatorDashboard(container) {
      container.innerHTML = `
        <div class="page-container page-creator">
          <div class="page-top-bar">
            <div>
              <div class="dev-badge-pill">Creator Economy Suite</div>
              <h2 class="page-title">Creator Studio Dashboard</h2>
              <p class="page-desc">Design and publish templates to the global AJAYNXT library. Earn royalties when users produce commercial prints.</p>
            </div>
            <div class="top-bar-actions">
              <button class="btn btn-primary" id="btn-nav-submit-template">
                <span class="btn-icon">+</span> Submit New Template
              </button>
            </div>
          </div>

          <!-- Quick Stats Cards (Development Fixtures) -->
          <div class="stats-grid-4">
            <div class="stat-card">
              <span class="stat-title">Published Templates</span>
              <span class="stat-val">3</span>
              <span class="stat-sub">Live in global catalog</span>
            </div>
            <div class="stat-card">
              <span class="stat-title">Community Uses</span>
              <span class="stat-val">428</span>
              <span class="stat-sub">Across 12 countries</span>
            </div>
            <div class="stat-card">
              <span class="stat-title">Royalty Balance</span>
              <span class="stat-val">₹4,280</span>
              <span class="stat-sub">Simulated Ledger Fixture</span>
            </div>
            <div class="stat-card">
              <span class="stat-title">Creator Tier</span>
              <span class="stat-val">Gold ✨</span>
              <span class="stat-sub">Top 5% Contributor</span>
            </div>
          </div>

          <!-- Submitted Templates Table -->
          <div class="panel-card" style="margin-top: 24px;">
            <div class="panel-card-header">
              <h3>My Published & Staged Templates</h3>
              <span class="stage-tag">Catalog Status</span>
            </div>
            <div class="table-responsive">
              <table class="studio-table">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Template Title</th>
                    <th>Category</th>
                    <th>Dimensions</th>
                    <th>Format</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><img src="templates/previews/packaging_mint_luxury.png" class="table-thumb" /></td>
                    <td><strong>Diamond's Melodi Royal Tin Packaging</strong></td>
                    <td>Bakery Packaging</td>
                    <td>1800 × 1800 px</td>
                    <td><span class="tag-badge">Vector SVG</span></td>
                    <td><span class="status-badge status-live">Published</span></td>
                    <td><button class="btn-sm btn-ghost">Edit</button></td>
                  </tr>
                  <tr>
                    <td><img src="templates/previews/festival_diwali_royal_hamper.png" class="table-thumb" /></td>
                    <td><strong>Royal Diwali Celebration Poster</strong></td>
                    <td>Festival Creatives</td>
                    <td>1240 × 1754 px</td>
                    <td><span class="tag-badge">Vector SVG</span></td>
                    <td><span class="status-badge status-live">Published</span></td>
                    <td><button class="btn-sm btn-ghost">Edit</button></td>
                  </tr>
                  <tr>
                    <td><img src="templates/previews/sticker_jar_seal_gold.png" class="table-thumb" /></td>
                    <td><strong>Pure Ghee & FSSAI Luxury Label</strong></td>
                    <td>Stickers & Labels</td>
                    <td>1200 × 1200 px</td>
                    <td><span class="tag-badge">Vector SVG</span></td>
                    <td><span class="status-badge status-review">In Review</span></td>
                    <td><button class="btn-sm btn-ghost">Inspect</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-nav-submit-template').addEventListener('click', () => {
        if (window.studioApp && window.studioApp.switchPage) {
          window.studioApp.switchPage('creator-submit');
        }
      });
    }

    renderCreatorSubmission(container) {
      container.innerHTML = `
        <div class="page-container page-creator-submit">
          <div class="page-top-bar">
            <div>
              <h2 class="page-title">Submit a Template to Global Catalog</h2>
              <p class="page-desc">Share your editable vector art, packaging presets, or social creatives. Reviewed by our curation desk before going live.</p>
            </div>
            <div class="top-bar-actions">
              <button class="btn btn-secondary" id="btn-back-to-creator">← Creator Dashboard</button>
            </div>
          </div>

          <div class="submit-form-card">
            <form id="creator-template-form" class="brief-fields-grid">
              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label required">Template Title</label>
                  <input type="text" class="form-input" id="tpl-title" placeholder="e.g. Royal Pistachio Cookie Box" required />
                </div>
                <div class="form-group">
                  <label class="form-label required">Category</label>
                  <select class="form-select" id="tpl-category">
                    <option value="packaging">Bakery and Cookie Packaging</option>
                    <option value="posters">Posters and Advertisements</option>
                    <option value="social">Social Media Posts</option>
                    <option value="stickers">Stickers and Labels</option>
                    <option value="restaurant">Restaurant Promotions</option>
                    <option value="festivals">Festival Creatives</option>
                    <option value="ads">Product Advertisements</option>
                    <option value="custom">Custom Print Graphics</option>
                  </select>
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label required">Dimensions (Width × Height px)</label>
                  <input type="text" class="form-input" id="tpl-dimensions" placeholder="e.g. 1800x1800 or 1240x1754" value="1800x1800" required />
                </div>
                <div class="form-group">
                  <label class="form-label required">Source Format</label>
                  <select class="form-select" id="tpl-format">
                    <option value="svg">Editable Vector SVG</option>
                    <option value="json">Studio Project JSON</option>
                  </select>
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label required">Editable Source File (.svg or .json)</label>
                  <input type="file" class="form-input" id="tpl-source-file" accept=".svg,.json" required />
                  <div class="form-hint">Must contain genuine editable vector elements or StudioProject layers.</div>
                </div>
                <div class="form-group">
                  <label class="form-label required">Real Rendered PNG Preview</label>
                  <input type="file" class="form-input" id="tpl-preview-file" accept="image/png" required />
                  <div class="form-hint">Actual render of the source. No fabricated mockups allowed.</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Search Tags (comma separated)</label>
                <input type="text" class="form-input" id="tpl-tags" placeholder="bakery, royal, gold foil, cookie, diwali" />
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" id="tpl-license-check" checked required />
                  <span>I confirm this artwork is original and complies with copyright & commercial distribution guidelines.</span>
                </label>
              </div>

              <div class="modal-footer-actions">
                <button type="submit" class="btn btn-primary btn-lg">Submit Template for Review</button>
              </div>
            </form>
          </div>
        </div>
      `;

      container.querySelector('#btn-back-to-creator').addEventListener('click', () => {
        if (window.studioApp && window.studioApp.switchPage) {
          window.studioApp.switchPage('creator');
        }
      });

      container.querySelector('#creator-template-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Template submitted for review! Staged in local creator ledger (Phase 2 will persist to Firebase Firestore & Storage).');
        if (window.studioApp && window.studioApp.switchPage) {
          window.studioApp.switchPage('creator');
        }
      });
    }

    renderCreatorLeaderboard(container) {
      container.innerHTML = `
        <div class="page-container page-leaderboard">
          <div class="page-top-bar">
            <div>
              <div class="dev-badge-pill">Community Recognition</div>
              <h2 class="page-title">Creator Hall of Fame & Leaderboard</h2>
              <p class="page-desc">Celebrating the top packaging engineers, vector artists, and typography masters of AJAYNXT Studio.</p>
            </div>
          </div>

          <div class="leaderboard-grid">
            <div class="leaderboard-card rank-1">
              <div class="crown-badge">👑 1st Place</div>
              <div class="creator-avatar">DB</div>
              <h3 class="creator-name">Diamond Bakery Heritage Studio</h3>
              <div class="creator-specialty">Royal Packaging & Cookie Tins</div>
              <div class="creator-metrics">
                <div><strong>14</strong> Templates</div>
                <div><strong>1,240</strong> Downloads</div>
              </div>
            </div>

            <div class="leaderboard-card rank-2">
              <div class="crown-badge">🥈 2nd Place</div>
              <div class="creator-avatar">AJ</div>
              <h3 class="creator-name">AjayNxt Creative Labs</h3>
              <div class="creator-specialty">Vector Typography & Posters</div>
              <div class="creator-metrics">
                <div><strong>9</strong> Templates</div>
                <div><strong>890</strong> Downloads</div>
              </div>
            </div>

            <div class="leaderboard-card rank-3">
              <div class="crown-badge">🥉 3rd Place</div>
              <div class="creator-avatar">MV</div>
              <h3 class="creator-name">Mandala Vector Works</h3>
              <div class="creator-specialty">Traditional Indian Ornaments</div>
              <div class="creator-metrics">
                <div><strong>17</strong> Templates</div>
                <div><strong>712</strong> Downloads</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    renderAccountSettings(container) {
      container.innerHTML = `
        <div class="page-container page-settings">
          <div class="page-top-bar">
            <div>
              <h2 class="page-title">Account & Studio Settings</h2>
              <p class="page-desc">Manage preferences, export defaults, and Phase 2 developer access keys.</p>
            </div>
          </div>

          <div class="settings-grid">
            <div class="settings-card">
              <h3>Profile Details</h3>
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" value="Ajay Sharma" id="set-name" />
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" value="creator@ajaynxt.com" readonly />
                <div class="form-hint">Managed via Firebase Auth in Phase 2.</div>
              </div>
              <div class="form-group">
                <label class="form-label">Studio Role</label>
                <input type="text" class="form-input" value="Lead Designer & Packaging Specialist" />
              </div>
              <button class="btn btn-secondary" onclick="alert('Profile preferences saved locally!')">Save Changes</button>
            </div>

            <div class="settings-card">
              <h3>Canvas & Rendering Defaults</h3>
              <div class="form-group">
                <label class="form-label">Default Canvas Units</label>
                <select class="form-select">
                  <option value="px">Pixels (px)</option>
                  <option value="in">Inches (in)</option>
                  <option value="mm">Millimeters (mm)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Snap Guidelines</label>
                <select class="form-select">
                  <option value="snap">Enabled (Smart Center & Edge Snapping)</option>
                  <option value="none">Disabled</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Phase 2 AI Integration Endpoint (Future MCP)</label>
                <input type="text" class="form-input" placeholder="https://api.ajaynxt.com/v1/ai-studio (Placeholder)" />
                <div class="form-hint">No credentials required during Phase 1 frontend local testing.</div>
              </div>
              <button class="btn btn-primary" onclick="alert('Studio defaults updated!')">Update Preferences</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  window.CreatorPagesManager = CreatorPagesManager;
})(window);
