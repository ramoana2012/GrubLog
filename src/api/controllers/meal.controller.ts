import { Request, Response } from 'express';
import { 
  db, 
  collection, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from '../config/firebase';
import { Meal } from '../models/meal.model';

// Collection reference
const mealsCollection = 'meals';

/**
 * Get all meals for the authenticated user
 */
export const getMeals = async (req: Request, res: Response) => {
  try {
    // Get user ID from request headers or body
    const userId = req.headers['x-user-id'] as string || req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Query meals for the specific user
    const mealsCollectionRef = collection(db, mealsCollection);
    
    // Filter by userId to ensure users only access their own data
    const mealsQuery = query(
      mealsCollectionRef,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const mealsSnapshot = await getDocs(mealsQuery);
    
    const meals: Meal[] = [];
    
    mealsSnapshot.forEach((docSnapshot) => {
      meals.push({
        id: docSnapshot.id,
        ...docSnapshot.data() as Omit<Meal, 'id'>
      });
    });
    
    return res.status(200).json(meals);
  } catch (error) {
    console.error('Error getting meals:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('permission-denied')) {
        return res.status(403).json({ 
          error: 'Permission denied',
          message: 'The current user does not have permission to access these meals.'
        });
      }
      
      if (error.message.includes('unavailable')) {
        return res.status(503).json({ error: 'Service unavailable. Please try again later.' });
      }
    }
    
    return res.status(500).json({ error: 'Failed to get meals' });
  }
};

/**
 * Get a specific meal by ID
 */
export const getMealById = async (req: Request, res: Response) => {
  try {
    // Get user ID from request headers or body
    const userId = req.headers['x-user-id'] as string || req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const mealId = req.params.id;
    
    // Get the meal document
    const mealDocRef = doc(db, mealsCollection, mealId);
    const mealDocSnapshot = await getDoc(mealDocRef);
    
    if (!mealDocSnapshot.exists()) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    const mealData = mealDocSnapshot.data() as Meal;
    
    // Verify that the meal belongs to the authenticated user
    if (mealData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied. You can only access your own meals.' });
    }
    
    return res.status(200).json({
      id: mealDocSnapshot.id,
      ...mealData
    });
  } catch (error) {
    console.error('Error getting meal:', error);
    return res.status(500).json({ error: 'Failed to get meal' });
  }
};

/**
 * Create a new meal
 */
export const createMeal = async (req: Request, res: Response) => {
  try {
    // Get user ID from request body or headers
    const userId = req.body.userId || req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Extract meal data from request body
    const { name, date, difficulty, nutrition, cuisine, rating, notes } = req.body;
    
    // Create meal object with required fields
    const mealData: Omit<Meal, 'id'> = {
      userId,
      name,
      date,
      difficulty,
      nutrition,
      cuisine,
      rating: parseFloat(rating),
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add meal to Firestore
    const mealsCollectionRef = collection(db, mealsCollection);
    const docRef = await addDoc(mealsCollectionRef, mealData);
    
    return res.status(201).json({
      id: docRef.id,
      ...mealData
    });
  } catch (error) {
    console.error('Error creating meal:', error);
    return res.status(500).json({ error: 'Failed to create meal' });
  }
};

/**
 * Update an existing meal
 */
export const updateMeal = async (req: Request, res: Response) => {
  try {
    // Get user ID from request body or headers
    const userId = req.body.userId || req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const mealId = req.params.id;
    
    // Get the meal document to verify ownership
    const mealDocRef = doc(db, mealsCollection, mealId);
    const mealDocSnapshot = await getDoc(mealDocRef);
    
    if (!mealDocSnapshot.exists()) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    const existingMealData = mealDocSnapshot.data() as Meal;
    
    // Verify that the meal belongs to the authenticated user
    if (existingMealData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied. You can only update your own meals.' });
    }
    
    // Extract meal data from request body
    const { name, date, difficulty, nutrition, cuisine, rating, notes } = req.body;
    
    // Update meal object
    const updatedMealData = {
      name,
      date,
      difficulty,
      nutrition,
      cuisine,
      rating: parseFloat(rating),
      notes: notes || '',
      updatedAt: new Date().toISOString()
    };
    
    // Update meal in Firestore
    await updateDoc(mealDocRef, updatedMealData);
    
    return res.status(200).json({
      id: mealId,
      userId,
      ...updatedMealData,
      createdAt: existingMealData.createdAt
    });
  } catch (error) {
    console.error('Error updating meal:', error);
    return res.status(500).json({ error: 'Failed to update meal' });
  }
};

/**
 * Delete a meal
 */
export const deleteMeal = async (req: Request, res: Response) => {
  try {
    // Get user ID from request headers or body
    const userId = req.headers['x-user-id'] as string || req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const mealId = req.params.id;
    
    // Get the meal document to verify ownership
    const mealDocRef = doc(db, mealsCollection, mealId);
    const mealDocSnapshot = await getDoc(mealDocRef);
    
    if (!mealDocSnapshot.exists()) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    const mealData = mealDocSnapshot.data() as Meal;
    
    // Verify that the meal belongs to the authenticated user
    if (mealData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied. You can only delete your own meals.' });
    }
    
    // Delete meal from Firestore
    await deleteDoc(mealDocRef);
    
    return res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return res.status(500).json({ error: 'Failed to delete meal' });
  }
};
