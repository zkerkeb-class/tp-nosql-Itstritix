import express from 'express';
import { allPkmnsController, getPkmnByIDController, addPkmnController, updatePkmnController, deletePkmnController } from '../controllers/pokemonController.js';
import { authMiddleware } from "../middlewares/authMiddleware.js"
const router = express.Router();

router.get("/:id", getPkmnByIDController);
router.get("/", allPkmnsController);
router.post("/", authMiddleware, addPkmnController);
router.put("/:id", authMiddleware, updatePkmnController);
router.delete("/:id", authMiddleware, deletePkmnController)


export { router };