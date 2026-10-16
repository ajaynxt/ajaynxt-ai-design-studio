/**
 * AJAYNXT AI Design Studio — Firebase Configuration
 * Dedicated Project: ajaynxt-ai-design-studio
 */

export const firebaseConfig = {
  projectId: "ajaynxt-ai-design-studio",
  appId: "1:536847137637:web:8589277390fd41b2eb7f8c",
  storageBucket: "ajaynxt-ai-design-studio.firebasestorage.app",
  apiKey: "AIzaSyDKd-gJ9rxugjO2XhgxyrV9QTHsELX6Bl4",
  authDomain: "ajaynxt-ai-design-studio.firebaseapp.com",
  messagingSenderId: "536847137637",
  projectNumber: "536847137637"
};

// Emulator configuration for local development
export const emulatorConfig = {
  useEmulators: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  authPort: 9099,
  firestorePort: 8080,
  storagePort: 9199,
  functionsPort: 5001
};
