import User from "../models/user.js";
import Pokemon from "../models/pokemon.js";

const addFavoriteController = async (req, res, next) => {
    try {
        const pokemonId = parseInt(req.params.pokemonId, 10);

        if (Number.isNaN(pokemonId) || pokemonId <= 0) {
            return res.status(400).json({ message: "L'identifiant du Pokémon est invalide." });
        }

        const pokemon = await Pokemon.findOne({ id: pokemonId });
        if (!pokemon) {
            return res.status(404).json({ message: "Pokémon introuvable." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { favorites: pokemonId } },
            { new: true }
        );

        return res.status(200).json({
            message: "Pokémon ajouté aux favoris.",
            favorites: updatedUser.favorites
        });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de l'ajout du favori.", error: error.message });
    }
};

const removeFavoriteController = async (req, res, next) => {
    try {
        const pokemonId = parseInt(req.params.pokemonId, 10);

        if (Number.isNaN(pokemonId) || pokemonId <= 0) {
            return res.status(400).json({ message: "L'identifiant du Pokémon est invalide." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { favorites: pokemonId } },
            { new: true }
        );

        return res.status(200).json({
            message: "Pokémon retiré des favoris.",
            favorites: updatedUser.favorites
        });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la suppression du favori.", error: error.message });
    }
};

const listFavoritesController = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        const favoritesIds = user.favorites || [];

        if (favoritesIds.length === 0) {
            return res.status(200).json({
                message: "Aucun Pokémon favori.",
                pokemons: []
            });
        }

        const pokemons = await Pokemon.find({ id: { $in: favoritesIds } });

        return res.status(200).json({
            message: "Liste des Pokémon favoris.",
            pokemons
        });
    } catch (error) {
        return res.status(500).json({ message: "Erreur lors de la récupération des favoris.", error: error.message });
    }
};

export { addFavoriteController, removeFavoriteController, listFavoritesController };

