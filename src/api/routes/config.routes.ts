import express from 'express';

const router = express.Router();

/**
 * @route GET /api/config
 * @desc Get application configuration
 * @access Public
 */
router.get('/', (req, res) => {
  // Only expose necessary configuration for the client
  // This keeps sensitive information secure while providing what the client needs
  const clientConfig = {
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    }
  };
  
  res.json(clientConfig);
});

export default router;
