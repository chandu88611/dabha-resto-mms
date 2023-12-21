// api.js

import express from 'express';
import dotenv from 'dotenv';
import { models } from '../../connection.js'; // Importing the existing connection and models
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const app = express.Router();

dotenv.config();


// Register a new user
app.post('/register',async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await models.User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ id: newUser.id, username: newUser.username, email: newUser.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// Login a user
app.post('/login',async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await models.User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
console.log(process.env)
    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, userId: user.id, username: user.username, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

export default app