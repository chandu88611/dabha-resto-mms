import express from 'express';
import { models } from '../../connection.js';
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Create a bill
router.post('/bills/create', verifyToken, async (req, res) => {
    try {
      const { totalAmount, taxTotal, grandTotal, paymentStatus, orderedItems } = req.body;
  
      // Fetch MenuItem data based on orderedItems array
      const menuItems = await Promise.all(
        orderedItems.map(async (data) => {
          const menuItem = await models.menuItem.findOne({
            where: {
              id: data,
            },
          });
          return menuItem; // Extract UUID
        })
      );
        
  console.log(menuItems)
      // Check if all MenuItem IDs are valid
      if (menuItems.length !== orderedItems.length) {
        return res.status(400).json({ status: false, message: 'Invalid MenuItem ID(s) provided', data: null });
      }
  
      // Create the bill with MenuItem objects
      const newBill = await models.Bill.create({
        totalAmount,
        taxTotal,
        grandTotal,
        paymentStatus,
        orderedItems:orderedItems,
      });
      const responseData = {
        id: newBill.id,
        billDate: newBill.billDate,
        totalAmount: newBill.totalAmount,
        taxTotal: newBill.taxTotal,
        grandTotal: newBill.grandTotal,
        paymentStatus: newBill.paymentStatus,
        orderedItems: menuItems,
        createdAt: newBill.createdAt,
        updatedAt: newBill.updatedAt,
      };
      res.status(201).json({ status: true, message: 'Bill created successfully', data:responseData});
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: error.message, data: null });
    }
  });
  
// Read all bills
router.get('/bills/get-all', verifyToken, async (req, res) => {
  try {
    const allBills = await models.Bill.findAll();
    res.json({ status: true, message: 'Bills retrieved successfully', data: allBills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error', data: null });
  }
});

// Update a bill
router.put('/bills/update/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { totalAmount, taxTotal, grandTotal, paymentStatus, orderedItems } = req.body;

    const updatedBill = await models.Bill.update(
      { totalAmount, taxTotal, grandTotal, paymentStatus, orderedItems },
      { where: { id }, returning: true }
    );

    res.json({ status: true, message: 'Bill updated successfully', data: updatedBill[1][0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error', data: null });
  }
});

// Delete a bill
router.delete('/bills/delete/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    await models.Bill.destroy({ where: { id } });

    res.status(204).json({ status: true, message: 'Bill deleted successfully', data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error', data: null });
  }
});

export default router;
