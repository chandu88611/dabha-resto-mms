import express from 'express';
import { body, validationResult } from 'express-validator';
import { Bill, BillProduct } from '../models/mongodb/bill.js';
import { verifyToken } from '../middleware/authMiddleware.js';

import MenuItem from '../models/mongodb/menu.js';

const router = express.Router();

// Create a new bill
const areProductsValid = async (value) => {
    const invalidProductIds = [];
    console.log(value)
    for (const product of value) {
      const existingProduct = await MenuItem.findById(product._id);
      if (!existingProduct) {
        invalidProductIds.push(product._id);
      }
    }
  
    if (invalidProductIds.length > 0) {
      return Promise.reject(`Products with IDs ${invalidProductIds.join(', ')} do not exist`);
    }
  };
router.post(
  '/add',
  verifyToken,
  [
    body('date', 'Date is required').notEmpty(),
    body('amount', 'Amount is required').notEmpty().isNumeric().withMessage('Amount must be a numeric value'),
    body('description', 'Description is required').notEmpty(),
    body('products', 'Invalid products').isArray().custom(areProductsValid),
    // Add more validation as needed
    // Add more validation as needed
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { user, customer, date, amount, description, is_invoice, is_receipt, products } = req.body;

      // Calculate total amount based on product prices
      const totalAmount = products.reduce((total, product) => total + product.amount, 0);

      const newBill = new Bill({
        user,
        customer,
        date,
        amount: totalAmount || amount, // Use the calculated total or provided amount
        description,
        is_invoice,
        is_receipt,
        products,
      });

      const savedBill = await newBill.save();
      res.status(201).json(savedBill);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Get all bills
router.get('/bills', verifyToken, async (req, res) => {
  try {
    const bills = await Bill.find().populate('user').populate('customer').populate('products');
    res.status(200).json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a bill by ID
router.get('/bills/:id', verifyToken, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('user').populate('customer').populate('products');
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.status(200).json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a bill by ID
router.put(
  '/bills/:id',
  verifyToken,
  [
    body('date', 'Date is required').notEmpty(),
    body('amount', 'Amount is required').notEmpty().isNumeric().withMessage('Amount must be a numeric value'),
    body('description', 'Description is required').notEmpty(),
    // Add more validation as needed
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { user, customer, date, amount, description, is_invoice, is_receipt, products } = req.body;

      // Calculate total amount based on product prices
      const totalAmount = products.reduce((total, product) => total + product.amount, 0);

      const updatedBill = await Bill.findByIdAndUpdate(
        req.params.id,
        {
          user,
          customer,
          date,
          amount: totalAmount || amount, // Use the calculated total or provided amount
          description,
          is_invoice,
          is_receipt,
          products,
        },
        { new: true }
      );

      if (!updatedBill) {
        return res.status(404).json({ error: 'Bill not found' });
      }

      res.status(200).json(updatedBill);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// Delete a bill by ID
router.delete('/bills/:id', verifyToken, async (req, res) => {
  try {
    const deletedBill = await Bill.findByIdAndDelete(req.params.id);
    if (!deletedBill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
