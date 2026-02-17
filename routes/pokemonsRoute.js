import express from 'express';
import { allPkmnsController, getPkmnByIDController, addPkmnController, updatePkmnController } from '../controllers/pokemonController.js';
const router = express.Router();

router.get("/pokemons/:id", getPkmnByIDController);
router.get("/pokemons", allPkmnsController);
router.post("/pokemons", addPkmnController);
router.post("/pokemons", updatePkmnController);


export { router };