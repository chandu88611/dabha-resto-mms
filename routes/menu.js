import express from 'express';
import MenuItem from '../models/mongodb/menu.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const isNameUnique = async (value) => {
  const existingMenuItem = await MenuItem.findOne({ name: value });
  if (existingMenuItem) {
    return Promise.reject('Name already exists');
  }
};
// Create a new menu item
router.post('/add', verifyToken, [
  body('name', 'Name is required').notEmpty(),
  body('description', 'Description is required').notEmpty(),
  body('price', 'Price is required').notEmpty().isNumeric().withMessage('Price must be a numeric value'),
  body('category', 'Category is required').notEmpty(),
  body('name', 'Invalid name. Should contain only letters and numbers').isAlphanumeric('en-US', { ignore: ' ' }),
  body('name').custom(isNameUnique)
  // Add more validation for description and category as needed
],async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, description, price, category } = req.body;

    const newMenuItem = new MenuItem({ name, description, price, category });
    const savedMenuItem = await newMenuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// Get all menu items
router.get('/get-all', verifyToken, async (req, res) => {
  try {
    const menuItems = await MenuItem.find().populate('category');
    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a menu item by ID
router.put('/update/:id', verifyToken, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category },
      { new: true }
    ).populate('category');
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a menu item by ID
router.delete('/menu/:id', verifyToken, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/category/:categoryId', verifyToken, async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const menuItems = await MenuItem.find({ category: categoryId }).populate('category');

    if (!menuItems || menuItems.length === 0) {
      return res.status(404).json({ error: 'No menu items found for the specified category' });
    }

    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
