# 🔥 AJAYNXT AI Design Studio — Firebase Backend & Production Deployment Guide (Phase 2)

> **Dedicated Firebase Project ID:** `ajaynxt-ai-design-studio`  
> **Firebase Console URL:** [https://console.firebase.google.com/project/ajaynxt-ai-design-studio/overview](https://console.firebase.google.com/project/ajaynxt-ai-design-studio/overview)  
> **Production Hosting URL:** `https://ajaynxt-ai-design-studio.web.app` (and `https://ajaynxt-ai-design-studio.firebaseapp.com`)  
> **Active Web App ID:** `1:536847137637:web:8589277390fd41b2eb7f8c`

---

## 1. Firebase Authentication with Google (1-Click Console Setup)

To allow real Google Sign-In with OAuth 2.0 popups:

### Step 1.1: Enable Google Provider
1. Open the [Firebase Console Authentication Providers](https://console.firebase.google.com/project/ajaynxt-ai-design-studio/authentication/providers).
2. Click **Get Started** (if not already enabled).
3. Under **Sign-in method**, click **Google**.
4. Toggle the **Enable** switch to **ON**.
5. Set the **Project public-facing name** to `AJAYNXT AI Design Studio`.
6. Select your **Project support email** (`ajayx3neha@gmail.com`).
7. Click **Save**.

### Step 1.2: Configure Authorized Domains
In the same Authentication section:
1. Go to **Settings** > **Authorized domains**.
2. Verify that these domains are present:
   - `localhost`
   - `127.0.0.1`
   - `ajaynxt-ai-design-studio.firebaseapp.com`
   - `ajaynxt-ai-design-studio.web.app`
   - `ajaynxt.github.io` (for transition period)
   - *Any custom commercial domain you plan to connect (e.g., `studio.ajaynxt.com`)*
3. Click **Add domain** if any domain is missing.

---

## 2. Cloud Firestore Database Setup

### Step 2.1: Initialize Firestore
1. Open [Firestore Database in Firebase Console](https://console.firebase.google.com/project/ajaynxt-ai-design-studio/firestore).
2. Click **Create database**.
3. Choose Database ID: `(default)`.
4. Choose Location: `asia-south1` (Mumbai) or `nam5` / `us-central1`.
5. Select **Production mode** (Security rules will be deployed via CLI).
6. Click **Enable**.

### Step 2.2: Deploy Security Rules & Indexes via CLI
Run from your terminal:
```bash
firebase deploy --only firestore:rules,firestore:indexes
```

---

## 3. Firebase Cloud Storage Setup

1. Open [Cloud Storage in Firebase Console](https://console.firebase.google.com/project/ajaynxt-ai-design-studio/storage).
2. Click **Get Started**.
3. Choose **Production mode**.
4. Select the storage location matching your Firestore database (`asia-south1` or `us-central1`).
5. Click **Done**.
6. Deploy storage security rules via CLI:
```bash
firebase deploy --only storage
```

---

## 4. Cloud Functions & External AI Provider Secrets

Cloud Functions in `functions/` provide serverless endpoints for AI Brief Refinement (Gemini) and Cloud Background Removal (remove.bg / Adobe Photoshop API).

### Step 4.1: Configure Environment Secrets
Run the following Firebase CLI commands to securely store your API keys:

```bash
# 1. Google Gemini API Key (for AI Design Assistant prompt refinement)
firebase functions:secrets:set GEMINI_API_KEY

# 2. remove.bg API Key (for fine hair & portrait cutouts)
firebase functions:secrets:set REMOVE_BG_API_KEY

# 3. Adobe Photoshop API Credentials (for bakery product edges & packaging)
firebase functions:secrets:set ADOBE_CLIENT_ID
firebase functions:secrets:set ADOBE_CLIENT_SECRET
```

### Step 4.2: Deploy Cloud Functions
```bash
firebase deploy --only functions
```

---

## 5. Local Development with Firebase Emulator Suite

You can run the entire backend offline on your machine (Auth, Firestore, Storage, Functions, Hosting):

```bash
# Start all emulators locally
firebase emulators:start
```
- **Emulator UI**: `http://localhost:4000`
- **Auth Emulator**: `http://localhost:9099`
- **Firestore Emulator**: `http://localhost:8080`
- **Storage Emulator**: `http://localhost:9199`
- **Hosting Preview**: `http://localhost:5000`

To connect the frontend to the local emulator, simply add `?emulator=true` to your URL:
`http://localhost:5000/?emulator=true`

---

## 6. Safe Migration Procedure (Private GitHub Repo + Firebase Hosting)

To transition from public GitHub Pages to a secure private repository hosted on Firebase:

### Step 6.1: Verify Firebase Hosting First
1. Deploy the site to Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```
2. Open `https://ajaynxt-ai-design-studio.web.app` in an incognito window.
3. Test all core features:
   - Vector canvas editing, object transformations, text editing.
   - Preserved Diamond Bakery 6" Round Tin & A4 Imposition sheet.
   - Google Sign-In and profile dropdown.
   - Background remover split slider and alpha PNG download.
   - Multi-format exports (PNG, SVG, PDF, JSON).

### Step 6.2: Switch GitHub Repository to Private
*Only after verifying that Firebase Hosting works 100%:*
1. Navigate to your repository on GitHub: `https://github.com/ajaynxt/ajaynxt-ai-design-studio/settings`.
2. Scroll to the **Danger Zone** at the bottom.
3. Under **Change repository visibility**, click **Change visibility** -> **Make private**.
4. Confirm by typing the repository name.

### Step 6.3: Retire GitHub Pages
1. In repository settings, go to the **Pages** tab: `https://github.com/ajaynxt/ajaynxt-ai-design-studio/settings/pages`.
2. Under **Build and deployment** > **Source**, change from *Deploy from a branch* to **None / Disabled**.
3. All production traffic will now resolve securely through Firebase Hosting at `https://ajaynxt-ai-design-studio.web.app` (backed by Google Cloud CDN and SSL).
