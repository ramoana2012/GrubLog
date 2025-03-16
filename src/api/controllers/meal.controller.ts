import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { Meal } from '../models/meal.model';

// Collection reference
const mealsCollection = 'meals';

/**
 * Get all meals for the authenticated user
 */
export const getMeals = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.uid;
    
    // Query meals for the specific user
    const mealsSnapshot = await db.collection(mealsCollection)
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .get();
    
    const meals: Meal[] = [];
    
    mealsSnapshot.forEach(doc => {
      meals.push({
        id: doc.id,
        ...doc.data() as Omit<Meal, 'id'>
      });
    });
    
    return res.status(200).json(meals);
  } catch (error) {
    console.error('Error getting meals:', error);
    return res.status(500).json({ error: 'Failed to get meals' });
  }
};

/**
 * Get a specific meal by ID
 */
export const getMealById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.uid;
    const mealId = req.params.id;
    
    // Get the meal document
    const mealDoc = await db.collection(mealsCollection).doc(mealId).get();
    
    if (!mealDoc.exists) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    const mealData = mealDoc.data() as Meal;
    
    // Verify that the meal belongs to the authenticated user
    if (mealData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    return res.status(200).json({
      id: mealDoc.id,
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
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.uid;
    const now = new Date().toISOString();
    
    // Prepare meal data
    const mealData: Meal = {
      ...req.body,
      userId,
      createdAt: now,
      updatedAt: now
    };
    
    // Add the meal to Firestore
    const mealRef = await db.collection(mealsCollection).add(mealData);
    
    return res.status(201).json({
      id: mealRef.id,
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
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.uid;
    const mealId = req.params.id;
    
    // Get the meal document
    const mealDoc = await db.collection(mealsCollection).doc(mealId).get();
    
    if (!mealDoc.exists) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    const mealData = mealDoc.data() as Meal;
    
    // Verify that the meal belongs to the authenticated user
    if (mealData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Prepare updated meal data
    const updatedMealData = {
      ...req.body,
      userId, // Ensure userId remains unchanged
      updatedAt: new Date().toISOString()
    };
    
    // Update the meal in Firestore
    await db.collection(mealsCollection).doc(mealId).update(updatedMealData);
    
    return res.status(200).json({
      id: mealId,
      ...updatedMealData
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
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.uid;
    const mealId = req.params.id;
    
    // Get the meal document
    const mealDoc = await db.collection(mealsCollection).doc(mealId).get();
    
    if (!mealDoc.exists) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    const mealData = mealDoc.data() as Meal;
    
    // Verify that the meal belongs to the authenticated user
    if (mealData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Delete the meal from Firestore
    await db.collection(mealsCollection).doc(mealId).delete();
    
    return res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return res.status(500).json({ error: 'Failed to delete meal' });
  }
};
