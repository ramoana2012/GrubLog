import { Router } from 'express';
import { verifyToken, createCustomToken } from '../controllers/auth.controller';
import authenticate from '../middleware/auth.middleware';

const router = Router();

// GET /api/auth/verify - Verify token and get user data
router.get('/verify', authenticate, verifyToken);

// POST /api/auth/custom-token - Create a custom token (development only)
router.post('/custom-token', createCustomToken);

export default router;
