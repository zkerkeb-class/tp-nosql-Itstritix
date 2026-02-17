import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        english: { type: String },
        japanese: { type: String },
        chinese: { type: String },
        french: { type: String, required: true },
    },
    type: {
        type: [String],
        required: true,
    },
    base: {
        HP: { type: Number, required: true },
        Attack: { type: Number, required: true },
        Defense: { type: Number, required: true },
        SpecialAttack: { type: Number },
        SpecialDefense: { type: Number },
        Speed: { type: Number },
    },
    image: {
        type: String,
    },
});

//  pokemon est le nom de la collection dans la base de données MongoDB. il y aura une collection nommée "pokemons"
const Pokemon = mongoose.model("pokemon", pokemonSchema);
export default Pokemon;