/**
 * AJAYNXT AI Design Studio — Authentication & App Check Middleware
 * Verifies Firebase ID Tokens and App Check tokens on all incoming gateway requests.
 */

const admin = require('firebase-admin');
const config = require('../config');

// Initialize Firebase Admin if credentials available or project ID set
try {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      projectId: config.projectId
    });
  }
} catch (e) {
  console.warn('Firebase Admin initialization notice:', e.message);
}

module.exports = async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  // 1. Check for Bearer token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const idToken = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || '',
        role: decodedToken.role || 'user'
      };

      // Optional App Check verification
      const appCheckToken = req.headers['x-firebase-appcheck'];
      if (appCheckToken && admin.appCheck) {
        try {
          await admin.appCheck().verifyToken(appCheckToken);
          req.appCheckVerified = true;
        } catch (appCheckErr) {
          console.warn('App Check verification failed:', appCheckErr.message);
        }
      }

      return next();
    } catch (err) {
      console.warn('Invalid Firebase ID token:', err.message);
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Invalid or expired Firebase ID token.',
        details: err.message
      });
    }
  }

  // 2. Development Mode Fallback
  if (config.env === 'development') {
    req.user = {
      uid: req.headers['x-mock-uid'] || 'dev_designer',
      email: 'designer@diamondbakery.in',
      displayName: 'Creative Director',
      role: 'user'
    };
    res.setHeader('X-Development-Bypass', 'active');
    return next();
  }

  return res.status(401).json({
    error: 'UNAUTHENTICATED',
    message: 'Missing Authorization header with Firebase Bearer token.'
  });
};
