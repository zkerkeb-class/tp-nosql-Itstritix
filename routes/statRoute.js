import express from 'express';
const router = express.Router();
import { statsController } from '../controllers/statController.js';

router.get("/stats", statsController)

export { router };