import Pokemon from '../models/pokemonModel.js';

const allPkmnsController = async (req, res, next) => {
    try {
        const pokemonsList = await Pokemon.find();
        res.status(200).json(pokemonsList);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

const getPkmnByIDController = async (req, res, next) => {
    try {
        const pkmnID = parseInt(req.params.id);
        const pokemon = await Pokemon.findOne({ id: pkmnID });
        if (!pokemon) return res.status(404).json({ error: 'Pokemon not found' });
        res.status(200).json(pokemon)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

const addPkmnController = async (req, res, next) => {
    try {
        const newPokemon = req.body;
        const pokemon = await Pokemon.findOne(newPokemon);
        if (pokemon) return res.status(401).json({ error: 'Pokemon already exists' });
        Pokemon.create(newPokemon);
        res.status(201).json({message: "Pokemon Created", pokemon: newPokemon});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const updatePkmnController = async (req, res, next) => {
    try {
        const newData = req.body
        const pkmnID = parseInt(req.params.id);
        const pokemon = await Pokemon.findOne({ id: pkmnID });
        if (!pokemon) return res.status(404).json({ error: 'Pokemon not found' });
        const pokemonToUpdate = await Pokemon.findOneAndUpdate(pokemon, newData, {
            new: true
        });
        
        const updatedPokemon = await Pokemon.findOne({id: pkmnID});

        res.status(200).json({message: "Pokemon updated", 
            updatedPokemon: pokemonToUpdate
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const deletePkmnController = async (req, res, next) => {
    try {
        const pkmnID = parseInt(req.params.id);
        const pokemon = await Pokemon.findOne({id: pkmnID});
        if (!pokemon) return res.status(404).json({ error: 'Pokemon not found' });
        const pokemonToDelete = await Pokemon.findOneAndDelete({id : pkmnID});
        res.status(204).json({message: "Pokemon deleted"});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export { allPkmnsController, getPkmnByIDController, addPkmnController, updatePkmnController, deletePkmnController };
