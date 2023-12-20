import express from 'express';

import { deleteUser, getAllUsers, loginUser, registerUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// User registration route
router.post('/register', registerUser);

// User deletion route (protected with token verification)
router.delete('/delete/:userId', verifyToken, deleteUser);

// User login route
router.post('/login', loginUser);
router.get('/all',verifyToken, getAllUsers);

// Protected route requiring a valid token for access
// router.get('/protected-route', verifyToken, protectedRoute);

export default router;
