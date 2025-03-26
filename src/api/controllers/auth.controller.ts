import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
      };
    }
  }
}

/**
 * Simple middleware that accepts user ID and email from request body or headers
 * This relies on client-side authentication only
 */
export default function authenticate(req: Request, res: Response, next: NextFunction) {
  // Get user ID from request body or headers
  const userId = req.body.userId || req.headers['x-user-id'];
  const userEmail = req.body.email || req.headers['x-user-email'];
  
  if (!userId) {
    return res.status(400).json({ 
      error: 'User ID is required',
      details: 'Please provide a user ID in the request body or x-user-id header'
    });
  }
  
  // Add user to request object
  req.user = { uid: userId, email: userEmail };
  
  next();
}
