import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "L'utilisateur est obligatoire pour une équipe."]
    },
    name: {
        type: String,
        required: [true, "Le nom de l'équipe est obligatoire."],
        trim: true
    },
    pokemons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "pokemon"
        }
    ]
}, {
    timestamps: true
});

teamSchema.path("pokemons").validate(function (value) {
    return !value || value.length <= 6;
}, "Une équipe ne peut pas contenir plus de 6 Pokémon.");

const Team = mongoose.model("Team", teamSchema);
export default Team;

