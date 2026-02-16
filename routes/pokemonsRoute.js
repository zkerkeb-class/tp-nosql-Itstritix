import express from 'express';
import { allPkmnsController, getPkmnByID } from '../controllers/pokemonController.js';
const router = express.Router();

router.get("/pokemons/:id", getPkmnByID);
router.get("/pokemons", allPkmnsController);


export { router };