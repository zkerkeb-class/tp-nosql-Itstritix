import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import dotenv from 'dotenv';

dotenv.config({ path: './.env.example' })

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId }, 
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: "Authentication token is either missing or invalid"});
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    
    if (!user) {
      return res.status(401).json({ message: "User doesn't exist" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({message: "Authentication token is invalid"});
  }
};

export { generateToken, authMiddleware };