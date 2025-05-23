import { Router } from 'express';
import { 
  getMeals, 
  getMealById, 
  createMeal, 
  updateMeal, 
  deleteMeal 
} from '../controllers/meal.controller';
import { validateMeal } from '../middleware/validation.middleware';

const router = Router();

// Routes no longer require server-side authentication
// GET /api/meals - Get all meals for the authenticated user
router.get('/', getMeals);

// GET /api/meals/:id - Get a specific meal by ID
router.get('/:id', getMealById);

// POST /api/meals - Create a new meal
router.post('/', validateMeal, createMeal);

// PUT /api/meals/:id - Update an existing meal
router.put('/:id', validateMeal, updateMeal);

// DELETE /api/meals/:id - Delete a meal
router.delete('/:id', deleteMeal);

export default router;
