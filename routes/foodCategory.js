import express from 'express';
import FoodCategory from '../models/foodCategory.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new food category
router.post('/add', verifyToken, async (req, res) => {
  console.log(req.body)
  try {
    const { name } = req.body;
    if(!name){
      res.status(400).json({ error: 'Food Category name is required' });
    }
    const newFoodCategory = new FoodCategory({ name });
    const savedFoodCategory = await newFoodCategory.save();
    res.status(201).json(savedFoodCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all food categories
router.get('/get-all', verifyToken, async (req, res) => {
  try {
    const foodCategories = await FoodCategory.find();
    res.status(200).json(foodCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a food category by ID
router.put('/food-categories/:id', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const updatedFoodCategory = await FoodCategory.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.status(200).json(updatedFoodCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a food category by ID
router.delete('/food-categories/:id', verifyToken, async (req, res) => {
  try {
    await FoodCategory.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
