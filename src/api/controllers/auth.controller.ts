import { Request, Response } from 'express';
import admin from '../config/firebase';

/**
 * Verify user token and return user data
 */
export const verifyToken = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get user details from Firebase
    const userRecord = await admin.auth().getUser(req.user.uid);
    
    // Return user data (excluding sensitive information)
    return res.status(200).json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ error: 'Failed to verify token' });
  }
};

/**
 * Create a custom token for testing purposes (development only)
 * This should not be used in production
 */
export const createCustomToken = async (req: Request, res: Response) => {
  // Only available in development environment
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'This endpoint is only available in development mode' });
  }
  
  try {
    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }
    
    // Create a custom token
    const customToken = await admin.auth().createCustomToken(uid);
    
    return res.status(200).json({ customToken });
  } catch (error) {
    console.error('Error creating custom token:', error);
    return res.status(500).json({ error: 'Failed to create custom token' });
  }
};
