import express from 'express';
import { allPkmnsController, getPkmnByIDController, addPkmnController, updatePkmnController, deletePkmnController } from '../controllers/pokemonController.js';
const router = express.Router();

router.get("/pokemons/:id", getPkmnByIDController);
router.get("/pokemons", allPkmnsController);
router.post("/pokemons", addPkmnController);
router.put("/pokemons/:id", updatePkmnController);
router.delete("/pokemons/:id", deletePkmnController)


export { router };