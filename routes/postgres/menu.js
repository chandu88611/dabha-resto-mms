import express from 'express';
import { models } from '../../connection.js'; 
import { verifyToken } from '../../middleware/authMiddleware.js';

const router = express.Router();



router.post('/menuItem/add',verifyToken, async (req, res) => {
    try {
      const { name, description, price, categoryId } = req.body;
      const newMenuItem = await models.menuItem.create({
        name,
        description,
        price,
        categoryId,
      });
  
      res.status(201).json({satus:true,message:"menu SuccessFully Created",data:newMenuItem});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  });
  
  router.get('/menuItems/get-all',verifyToken, async (req, res) => {
    try {
      const menuItems = await models.menuItem.findAll();
      res.json(menuItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  });
  
  router.put('/menuItems/:id',verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, categoryId } = req.body;
  
      const updatedMenuItem = await models.menuItem.update(
        { name, description, price, categoryId },
        { where: { id }, returning: true }
      );
  
      res.json(updatedMenuItem[1][0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  });
  
  router.delete('/menuItems/:id',verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
  
      await models.menuItem.destroy({ where: { id } });
  
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  });
  
  // Food Categories CRUD operations
  
  router.post('/foodCategory/add',verifyToken, async (req, res) => {
    try {
      const { categoryName } = req.body;
  
      const newFoodCategory = await models.foodCategory.create({
        categoryName,
      });
  
      res.status(201).json(newFoodCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  });
  
  router.get('/foodCategories/get-all',verifyToken, async (req, res) => {
    try {
      const foodCategories = await models.foodCategory.findAll();
      res.json(foodCategories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  });
  
  router.get('/menuItems/get-by-category/:categoryId', verifyToken, async (req, res) => {
    try {
      const { categoryId } = req.params;
  
      const menuItems = await models.menuItem.findAll({
        where: { categoryId },
      });
  
      res.json(menuItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  });

  export default router;