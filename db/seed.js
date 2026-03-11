import connect from "./db.js";
import Pokemon from '../models/pokemon.js';
import fs from 'fs';
import mongoose from 'mongoose';

const seed = async () => {
    try {
        await connect;
        const data = fs.readFileSync('./data/pokemons.json', 'utf8');
        const pokemons = JSON.parse(data);
        await Pokemon.deleteMany({});
        await Pokemon.insertMany(pokemons);
        console.log("Les 151 premiers pokémons ont été ajoutés.")
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }


};

seed();