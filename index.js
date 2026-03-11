// Charger les variables d'environnement en PREMIER (avant tout autre import)
// dotenv lit le fichier .env et rend les variables accessibles via process.env
import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';
import connect from './db/db.js'

import { router as pokemonRouter } from './routes/pokemonsRoute.js';
import { router as authRouter } from './routes/authRoutes.js';
import { router as statRoute } from './routes/statRoute.js';
import { router as favoritesRouter } from './routes/favoritesRoute.js';
import { router as teamsRouter } from './routes/teamsRoute.js';

await connect;

const app = express();

dotenv.config({ path: './.env.example' })

app.use(cors()); // Permet les requêtes cross-origin (ex: frontend sur un autre port)
app.use(express.json());

app.use('/assets', express.static('assets')); // Permet d'accéder aux fichiers dans le dossier "assets" via l'URL /assets/...

app.use("/api/pokemons", pokemonRouter);
app.use("/auth", authRouter);
app.use("/api/", statRoute);
app.use("/api/favorites", favoritesRouter);
app.use("/api/teams", teamsRouter);


app.get('/', (req, res) => {
    res.send('Hello, World!');
});



app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});