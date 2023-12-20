// Import necessary modules
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { Category, PharmacyProduct } from '../models/product.js';



const router = express.Router();

// Create Category
router.post('/categories', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const user = req.userId; // Assuming userId is attached by your authentication middleware

    const category = new Category({ name, user });
    await category.save();

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Category
router.put('/categories/:categoryId', verifyToken, async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(categoryId, { name }, { new: true });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Category
router.delete('/categories/:categoryId', verifyToken, async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const category = await Category.findByIdAndRemove(categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create PharmacyProduct
router.post('/products', verifyToken, async (req, res) => {
  try {
    const { name, category, price, quantity, expiration_date, batch_number, serial_number, barcode } = req.body;
    const user = req.userId; // Assuming userId is attached by your authentication middleware

    const product = new PharmacyProduct({
      name,
      category,
      price,
      quantity,
      expiration_date,
      batch_number,
      serial_number,
      barcode,
      user,
    });

    await product.save();

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update PharmacyProduct
router.put('/products/:productId', verifyToken, async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, category, price, quantity, expiration_date, batch_number, serial_number, barcode } = req.body;

    const product = await PharmacyProduct.findByIdAndUpdate(
      productId,
      { name, category, price, quantity, expiration_date, batch_number, serial_number, barcode },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete PharmacyProduct
router.delete('/products/:productId', verifyToken, async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await PharmacyProduct.findByIdAndRemove(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
