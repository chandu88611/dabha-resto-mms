import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import CustomUser from '../models/users.js';

dotenv.config();

const registerUser = async (req, res) => {
    console.log(req)
    try {
      const { email, password, first_name, last_name, role } = req.body;
      // Additional validation
      if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required' });
      }
  
      const existingUser = await CustomUser.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new CustomUser({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        roles: [role], // Assuming roles is an array
      });
  
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
  
      // Handle specific validation errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
  
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const getAllUsers = async (req, res) => {
    
    try {
      // Fetch all users from the database
      const users = await CustomUser.find()
  
      // Send the list of users as a response
      res.status(200).json({ users });
    } catch (error) {
      // Handle errors
      console.error(error);
  
      // Send an error response to the client
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await CustomUser.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.remove();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  };

  const loginUser = async (req, res) => {
    console.log(req.body)
  try {
    const { email, password } = req.body;
   
    const user = await CustomUser.findOne({ email });
    console.log(user)

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  };

export { registerUser, deleteUser, loginUser,getAllUsers };
