import pokemonModel from '../models/pokemonModel.js';

const allPkmnsController = async (req, res, next) => {
    try {
        const pokemonsList = await pokemonModel.find(); // Récupère tous les pokémons de la collection
        res.status(200).json(pokemonsList);
    } catch (error) {
        res.status(400).json({message: "Pokemons not found"})
    }
};

const getPkmnByID = async (req, res, next) => {
    const pkmnID = parseInt(req.params.id);
    const pokemon = await pokemonModel.findOne({ id: pkmnID });
    res.status(200).json(pokemon)
    try {

    } catch (error) {
        res.status(400).json({message: "Pokemon not found"})
    }
};

export { allPkmnsController, getPkmnByID };
