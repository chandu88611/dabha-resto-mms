// Import necessary modules
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const verifyToken = (req, res, next) => {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Access denied, token missing' });
    }
  
    // Check if the header starts with 'Bearer '
    const [bearer, token] = authorizationHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Access denied, token missing' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decodedToken.userId; // Attach the user ID to the request for future use
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
