import express from 'express';
const router = express.Router();
import { registerController, loginController } from '../controllers/authController.js';

router.post("/register", registerController)
router.post("/login", loginController)

export { router };