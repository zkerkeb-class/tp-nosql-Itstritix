import express from 'express';
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { addFavoriteController, removeFavoriteController, listFavoritesController } from "../controllers/favoriteController.js";

const router = express.Router();

router.get("/", authMiddleware, listFavoritesController);
router.post("/:pokemonId", authMiddleware, addFavoriteController);
router.delete("/:pokemonId", authMiddleware, removeFavoriteController);

export { router };

