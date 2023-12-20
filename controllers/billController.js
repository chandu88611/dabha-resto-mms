
// Import necessary modules
import express from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { Bill } from '../models/bill';

const router = express.Router();
// Create Bill
router.post('/bills', verifyToken, async (req, res) => {
  try {
    const { user, customer, date, amount, description, products, is_invoice, is_receipt } = req.body;
    const userId = req.userId; 
    const bill = new Bill({
      user: userId,
      customer,
      date,
      amount,
      description,
      is_invoice,
      is_receipt,
      products: products.map((product) => ({
        product: product.product,
        quantity: product.quantity,
        amount: product.amount,
      })),
    });
    await bill.save();

    res.status(201).json({ message: 'Bill created successfully', bill });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Bill
router.put('/bills/:billId', verifyToken, async (req, res) => {

  try {
    const billId = req.params.billId;
    const { user, customer, date, amount, description, products, is_invoice, is_receipt } = req.body;
    
    const updatedBill = await Bill.findByIdAndUpdate(
      billId,
      {
        user,
        customer,
        date,
        amount,
        description,
        is_invoice,
        is_receipt,
        products: products.map((product) => ({
          product: product.product,
          quantity: product.quantity,
          amount: product.amount,
        })),
      },
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.status(200).json({ message: 'Bill updated successfully', bill: updatedBill });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

export default router;
