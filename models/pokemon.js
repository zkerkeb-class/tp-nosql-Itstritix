import mongoose from "mongoose";

const allowedTypes = [
    'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting',
    'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost',
    'Dragon', 'Dark', 'Steel', 'Fairy'
];

const pokemonSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, "L'ID du Pokémon est obligatoire."],
        unique: true,
        min: [1, "L'ID doit être un entier positif."],
        validate: {
            validator: Number.isInteger,
            message: "L'ID doit être un entier."
        }
    },
    name: {
        english: { type: String },
        japanese: { type: String },
        chinese: { type: String },
        french: {
            type: String,
            required: [true, "Le nom français est obligatoire."]
        },
    },
    type: {
        type: [String],
        enum: {
            values: allowedTypes,
            message: "Le type '{VALUE}' n'est pas valide."
        },
        required: [true, "Au moins un type est requis."],
    },
    base: {
        HP: {
            type: Number,
            required: [true, "La statistique HP est obligatoire."],
            min: [1, "La statistique HP doit être comprise entre 1 et 255."],
            max: [255, "La statistique HP doit être comprise entre 1 et 255."]
        },
        Attack: {
            type: Number,
            required: [true, "La statistique Attack est obligatoire."],
            min: [1, "La statistique Attack doit être comprise entre 1 et 255."],
            max: [255, "La statistique Attack doit être comprise entre 1 et 255."]
        },
        Defense: {
            type: Number,
            required: [true, "La statistique Defense est obligatoire."],
            min: [1, "La statistique Defense doit être comprise entre 1 et 255."],
            max: [255, "La statistique Defense doit être comprise entre 1 et 255."]
        },
        SpecialAttack: {
            type: Number,
            min: [1, "La statistique SpecialAttack doit être comprise entre 1 et 255."],
            max: [255, "La statistique SpecialAttack doit être comprise entre 1 et 255."]
        },
        SpecialDefense: {
            type: Number,
            min: [1, "La statistique SpecialDefense doit être comprise entre 1 et 255."],
            max: [255, "La statistique SpecialDefense doit être comprise entre 1 et 255."]
        },
        Speed: {
            type: Number,
            min: [1, "La statistique Speed doit être comprise entre 1 et 255."],
            max: [255, "La statistique Speed doit être comprise entre 1 et 255."]
        },
    },
    image: {
        type: String,
    },
});

const Pokemon = mongoose.model("pokemon", pokemonSchema);
export default Pokemon;