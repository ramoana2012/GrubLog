import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { Difficulty, Nutrition, isValidRating } from '../models/meal.model';

// Validation schema for creating/updating a meal
const mealSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  date: Joi.string().isoDate().required(),
  difficulty: Joi.string().valid(...Object.values(Difficulty)).required(),
  nutrition: Joi.string().valid(...Object.values(Nutrition)).required(),
  cuisine: Joi.string().trim().min(1).max(50).required(),
  rating: Joi.number().custom((value, helpers) => {
    if (!isValidRating(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'Rating validation').required()
    .messages({
      'any.invalid': 'Rating must be between 0 and 5 with 0.5 increments'
    }),
  notes: Joi.string().allow('').max(1000).optional()
});

// Middleware to validate meal data
export const validateMeal = (req: Request, res: Response, next: NextFunction) => {
  const { error } = mealSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ error: errorMessage });
  }
  
  next();
};

export default validateMeal;
