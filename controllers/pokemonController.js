import Pokemon from '../models/pokemonModel.js';

const allPkmnsController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        var pokemonsList;
        
        var type = req.query.type;
        var name = req.query.name;
        var sort = req.query.sort; 
        const filter = {}

        if (type) {
            filter.type = type.charAt(0).toUpperCase() + type.slice(1)
        }

        if (name) {
            filter.$or = [
                {"name.english": { $regex: name, $options: "i" }},
                {"name.japanese": { $regex: name, $options: "i" }},
                {"name.chinese": { $regex: name, $options: "i" }},
                {"name.french": { $regex: name, $options: "i"}}
            ]
        }

        if (sort) {
            const order = sort.startsWith("-") ? -1 : 1;
            const field = sort.startsWith("-") ? sort.slice(1) : sort;

            pokemonsList = await Pokemon.find(filter).sort({ [field]: order }).skip(skip).limit(limit);
            return res.json(pokemonsList);
        }
        

        pokemonsList = await Pokemon.find(filter).skip(skip).limit(limit)
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
