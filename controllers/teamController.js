import Team from "../models/team.js";
import Pokemon from "../models/pokemon.js";

const createTeamController = async (req, res, next) => {
    try {
        const { name, pokemons } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Le nom de l'équipe est obligatoire." });
        }

        const pokemonIds = Array.isArray(pokemons) ? pokemons : [];

        if (pokemonIds.length > 6) {
            return res.status(400).json({ message: "Une équipe ne peut pas contenir plus de 6 Pokémon." });
        }

        const pokemonDocs = await Pokemon.find({ id: { $in: pokemonIds } }, "_id");

        if (pokemonDocs.length !== pokemonIds.length) {
            return res.status(400).json({ message: "Un ou plusieurs identifiants de Pokémon sont invalides." });
        }

        const team = new Team({
            user: req.user._id,
            name,
            pokemons: pokemonDocs.map(p => p._id)
        });

        await team.save();
        await team.populate("pokemons");

        return res.status(201).json({
            message: "Équipe créée avec succès.",
            team
        });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la création de l'équipe.", error: error.message });
    }
};

const listTeamsController = async (req, res, next) => {
    try {
        const teams = await Team.find({ user: req.user._id }).select("-__v");
        return res.status(200).json(teams);
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération des équipes.", error: error.message });
    }
};

const getTeamByIdController = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.id)
            .where({ user: req.user._id })
            .populate("pokemons");

        if (!team) {
            return res.status(404).json({ message: "Équipe introuvable." });
        }

        return res.status(200).json(team);
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération de l'équipe.", error: error.message });
    }
};

const updateTeamController = async (req, res, next) => {
    try {
        const { name, pokemons } = req.body;

        const team = await Team.findById(req.params.id).where({ user: req.user._id });

        if (!team) {
            return res.status(404).json({ message: "Équipe introuvable." });
        }

        if (name) {
            team.name = name;
        }

        if (pokemons) {
            const pokemonIds = Array.isArray(pokemons) ? pokemons : [];

            if (pokemonIds.length > 6) {
                return res.status(400).json({ message: "Une équipe ne peut pas contenir plus de 6 Pokémon." });
            }

            const pokemonDocs = await Pokemon.find({ id: { $in: pokemonIds } }, "_id");

            if (pokemonDocs.length !== pokemonIds.length) {
                return res.status(400).json({ message: "Un ou plusieurs identifiants de Pokémon sont invalides." });
            }

            team.pokemons = pokemonDocs.map(p => p._id);
        }

        await team.save();
        await team.populate("pokemons");

        return res.status(200).json({
            message: "Équipe mise à jour avec succès.",
            team
        });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la mise à jour de l'équipe.", error: error.message });
    }
};


const deleteTeamController = async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.id).where({ user: req.user._id });

        if (!team) {
            return res.status(404).json({ message: "Équipe introuvable." });
        }

        await team.deleteOne();

        return res.status(200).json({ message: "Équipe supprimée avec succès." });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la suppression de l'équipe.", error: error.message });
    }
};

export {
    createTeamController,
    listTeamsController,
    getTeamByIdController,
    updateTeamController,
    deleteTeamController
};

