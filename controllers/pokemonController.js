import Pokemon from '../models/pokemonModel.js';

const allPkmnsController = async (req, res, next) => {
    try {
        const pokemonsList = await Pokemon.find();
        res.status(200).json(pokemonsList);
    } catch (error) {
        res.status(400).json({message: "Pokemons not found", error: error})
    }
};

const getPkmnByIDController = async (req, res, next) => {
    try {
        const pkmnID = parseInt(req.params.id);
        const pokemon = await Pokemon.findOne({ id: pkmnID });
        res.status(200).json(pokemon)
    } catch (error) {
        res.status(400).json({message: "Pokemon not found"})
    }
};

const addPkmnController = async (req, res, next) => {
    try {
        const pokemon = req.body
        Pokemon.create(pokemon)
        res.status(201).json({message: "Pokemon Created", pokemon: pokemon});
    } catch (error) {
        res.status(400).json({message: "Unauthorized access"});
    }
}

const updatePkmnController = async (req, res, next) => {
    try {

    } catch (error) {

    }
}

export { allPkmnsController, getPkmnByIDController, addPkmnController, updatePkmnController };
