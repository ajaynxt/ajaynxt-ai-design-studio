/**
 * AJAYNXT AI Design Studio — Cloud Run Multi-Provider AI API Gateway
 *
 * Implements:
 * - Firebase ID Token & App Check validation
 * - Multi-provider routing: Gemini API, NVIDIA NIM, Google Imagen 3, Photoroom, Cloud Vision OCR, Hugging Face
 * - Real-time provider health & configuration state tracking
 * - Budget controls, alerts, and hard generation stops
 * - Request validation and rate limiting
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const authenticate = require('./middleware/auth');

// Route modules
const healthRoutes = require('./routes/health');
const aiRoutes = require('./routes/ai');
const imageRoutes = require('./routes/image');
const bgRoutes = require('./routes/background');
const ocrRoutes = require('./routes/ocr');
const budgetRoutes = require('./routes/budget');

const app = express();

// 1. Security & Logging Middlewares
app.use(helmet());
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

// CORS configuration for Firebase Hosting & Local Development
const allowedOrigins = [
  'https://ajaynxt-ai-design-studio.web.app',
  'https://ajaynxt-ai-design-studio.firebaseapp.com',
  'https://ajaynxt.github.io',
  'http://localhost:5000',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:5000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.web.app') || origin.endsWith('.firebaseapp.com')) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed.'));
    }
  },
  credentials: true
}));

// Body Parser with 30MB limit for high-res artwork uploads
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Global Rate Limiter (120 requests per minute per IP)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'TOO_MANY_REQUESTS',
    message: 'Global rate limit exceeded (120 requests/minute). Please slow down.'
  }
});
app.use(globalLimiter);

// 2. Public Endpoints (Health, Provider Readiness Status)
app.use('/api/v1', healthRoutes);

// 3. Authenticated Endpoints (Protected by Firebase Auth & Budget Middleware)
app.use('/api/v1/ai', authenticate, aiRoutes);
app.use('/api/v1/image', authenticate, imageRoutes);
app.use('/api/v1/background', authenticate, bgRoutes);
app.use('/api/v1/ocr', authenticate, ocrRoutes);
app.use('/api/v1/budget', authenticate, budgetRoutes);

// 4. Root Welcome
app.get('/', (req, res) => {
  res.json({
    service: 'AJAYNXT AI Design Studio — Cloud Run API Gateway',
    version: '2.0.0',
    documentation: '/api/v1/providers/status',
    health: '/api/v1/health'
  });
});

// 5. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled gateway error:', err);
  res.status(err.status || 500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred in the gateway.'
  });
});

// Start Server
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`\n🚀 AJAYNXT Cloud Run AI Gateway listening on port ${config.port} [${config.env}]`);
    console.log(`   Health Check: http://localhost:${config.port}/api/v1/health`);
    console.log(`   Provider Status: http://localhost:${config.port}/api/v1/providers/status\n`);
  });
}

module.exports = app;
