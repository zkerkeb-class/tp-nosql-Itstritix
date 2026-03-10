## TP NoSQL — API Pokémon (Express + MongoDB)

Nom & Prénom : TSUI Jia-Bao
Bonus : Tous les exercices du 6

API REST en **Node.js/Express** connectée à **MongoDB** via **Mongoose**.

### Prérequis

- **Node.js** (recommandé: LTS)
- **MongoDB** en local (ex: `mongodb://localhost:27017`)

### Installation

```bash
npm install
```

### Configuration (.env)

Le projet charge actuellement le fichier **`.env.example`** (voir `index.js` et `middlewares/authMiddleware.js`).

Contenu attendu :

- **`PORT`**: port HTTP de l’API (ex: `3000`)
- **`MONGODB_URI`**: URI MongoDB (ex: `mongodb://localhost:27017/pokemon-nosql`)
- **`API_URL`**: URL de l’API (ex: `http://localhost:3000`)
- **`JWT_SECRET`**: secret JWT

> Important
>
> - **Connexion MongoDB**: `db/db.js` utilise une URI **en dur** (`mongodb://localhost:27017/pokemon-nosql`) et n’utilise pas `MONGODB_URI`.
> - **dotenv**: l’app utilise `dotenv.config({ path: './.env.example' })`, donc si tu crées un `.env`, il ne sera pas pris en compte sans modifier le code.

### Lancer le projet

- **Seed de la base** (importe `data/pokemons.json`) :

```bash
npm run seed
```

- **Mode dev** (nodemon) :

```bash
npm run dev
```

### Authentification (JWT)

Certaines routes sont protégées par `authMiddleware`.

- Header à fournir :
  - **`Authorization: Bearer <token>`**
- Le token se récupère via `POST /auth/login`.

---

## Base URL

Par défaut (si `PORT=3000`) :

- `http://localhost:3000`

---

## Routes — Auth

### `POST /auth/register`

Crée un utilisateur.

- **Body JSON**
  - `username` (string, requis)
  - `email` (string, requis)
  - `password` (string, requis, min 8)

#### Exemples de requêtes

- **Créer un utilisateur**

  - Méthode: **POST**
  - URL: `/auth/register`
  - Body:

  ```json
  {
    "username": "ash",
    "email": "ash@example.com",
    "password": "pikachu123"
  }
  ```

  - Attendu: `201`, message de succès.

- **Conflit username/email**

  - Méthode: **POST**
  - URL: `/auth/register`
  - Body:

  ```json
  {
    "username": "ash2",
    "email": "ash@example.com",
    "password": "pikachu123"
  }
  ```

  - Attendu: `403`.

### `POST /auth/login`

Connexion, renvoie un JWT.

- **Body JSON**
  - `username` (string)
  - `password` (string)

#### Exemples de requêtes

- **Login correct**

  - Méthode: **POST**
  - URL: `/auth/login`
  - Body:

  ```json
  {
    "username": "ash",
    "password": "pikachu123"
  }
  ```

  - Attendu: `200`, la réponse contient un champ `token`.

- **Mot de passe incorrect**

  - Méthode: **POST**
  - URL: `/auth/login`
  - Body:

  ```json
  {
    "username": "ash",
    "password": "wrongpass"
  }
  ```

  - Attendu: `401`.

---

## Routes — Pokémons

### `GET /api/pokemons`

Liste paginée + filtres.

- **Query params**
  - `page` (number, défaut 1)
  - `limit` (number, défaut 50)
  - `type` (string) — ex: `fire` / `Fire`
  - `name` (string) — recherche sur `name.*` (regex, insensitive)
  - `sort` (string) — ex: `id`, `-id`, `base.HP` (selon champs existants)

#### Exemples de requêtes

- **Liste simple**
  - Méthode: **GET**
  - URL: `/api/pokemons`
  - Attendu: `200`, tableau de pokémons.

- **Pagination**
  - Méthode: **GET**
  - URL: `/api/pokemons?page=2&limit=10`
  - Attendu: `200`, page 2 avec 10 résultats max.

- **Filtre par type**
  - Méthode: **GET**
  - URL: `/api/pokemons?type=fire`
  - Attendu: `200`, uniquement des pokémons avec le type Fire.

- **Recherche par nom**
  - Méthode: **GET**
  - URL: `/api/pokemons?name=pika`
  - Attendu: `200`, Pikachu présent dans les résultats.

- **Tri**
  - Méthode: **GET**
  - URL: `/api/pokemons?sort=-id`
  - Attendu: `200`, tri décroissant sur l’id.

### `GET /api/pokemons/:id`

Récupère un Pokémon par **id** (numérique).

#### Exemples de requêtes

- **Pokémon existant**
  - Méthode: **GET**
  - URL: `/api/pokemons/25`
  - Attendu: `200`, Pikachu.

- **Pokémon inexistant**
  - Méthode: **GET**
  - URL: `/api/pokemons/999999`
  - Attendu: `404`.

### `POST /api/pokemons` (protégée)

Crée un Pokémon.

- **Auth**: Bearer token requis
- **Body JSON (exemple minimal)**

```json
{
  "id": 999,
  "name": { "french": "Testmon" },
  "type": ["Fire"],
  "base": { "HP": 50, "Attack": 60, "Defense": 40 }
}
```

#### Validation (6.C)

- **`id`**: entier positif
- **`type`**: dans la liste autorisée
- **Stats**: entre **1** et **255** (HP/Attack/Defense + SpecialAttack/SpecialDefense/Speed si fournis)
- **Messages**: en français (définis au niveau du schéma Mongoose)

#### Exemples de requêtes

- **Création valide**
  - Méthode: **POST**
  - URL: `/api/pokemons`
  - Headers: `Authorization: Bearer <token>`
  - Body:

  ```json
  {
    "id": 999,
    "name": { "french": "Testmon" },
    "type": ["Fire"],
    "base": { "HP": 50, "Attack": 60, "Defense": 40 }
  }
  ```

  - Attendu: `201`.

- **Sans token**
  - Méthode: **POST**
  - URL: `/api/pokemons`
  - Body identique ci-dessus
  - Attendu: `401`.

- **ID/stat/type invalides**
  - Méthode: **POST**
  - URL: `/api/pokemons`
  - Headers: `Authorization: Bearer <token>`
  - Body:

  ```json
  {
    "id": -1,
    "name": { "french": "Bad" },
    "type": ["InvalidType"],
    "base": { "HP": 0, "Attack": 300, "Defense": 10 }
  }
  ```

  - Attendu: erreur de validation (statut 400/500 avec messages en français).

### `PUT /api/pokemons/:id` (protégée)

Modifie un Pokémon.

- **Auth**: Bearer token requis
- **Body JSON**: champs à modifier (ex: `base.HP`, `type`, `name.french`, etc.)

#### Exemples de requêtes

- **Mise à jour valide**
  - Méthode: **PUT**
  - URL: `/api/pokemons/999`
  - Headers: `Authorization: Bearer <token>`
  - Body:

  ```json
  {
    "base": { "HP": 80 }
  }
  ```

  - Attendu: `200`, HP mis à 80.

- **Stat invalide**
  - Méthode: **PUT**
  - URL: `/api/pokemons/999`
  - Headers: `Authorization: Bearer <token>`
  - Body:

  ```json
  {
    "base": { "HP": 0 }
  }
  ```

  - Attendu: erreur de validation.

### `DELETE /api/pokemons/:id` (protégée)

Supprime un Pokémon.

#### Exemples de requêtes

- **Suppression d’un Pokémon existant**
  - Méthode: **DELETE**
  - URL: `/api/pokemons/999`
  - Headers: `Authorization: Bearer <token>`
  - Attendu: `200`.

- **Sans token**
  - Méthode: **DELETE**
  - URL: `/api/pokemons/999`
  - Attendu: `401`.

---

## Routes — Favoris (6.A)

Favoris stockés dans `User.favorites: [Number]` (IDs Pokémon).

### `GET /api/favorites` (protégée)

Liste les Pokémon favoris de l’utilisateur connecté.

#### Exemples de requêtes

- **Lister les favoris**
  - Méthode: **GET**
  - URL: `/api/favorites`
  - Headers: `Authorization: Bearer <token>`
  - Attendu: `200`, objet avec `pokemons: []` ou une liste de pokémons.

### `POST /api/favorites/:pokemonId` (protégée)

Ajoute un favori (sans doublon via `$addToSet`).

#### Exemples de requêtes

- **Ajouter un favori**
  - Méthode: **POST**
  - URL: `/api/favorites/25`
  - Headers: `Authorization: Bearer <token>`
  - Attendu: `200`, le tableau `favorites` contient `25`.

- **Ajouter le même favori deux fois**
  - Méthode: **POST**
  - URL: `/api/favorites/25` (appelé 2 fois)
  - Headers: `Authorization: Bearer <token>`
  - Attendu: `200`, pas de doublon dans `favorites`.

- **ID invalide**
  - Méthode: **POST**
  - URL: `/api/favorites/0`
  - Headers: `Authorization: Bearer <token>`
  - Attendu: `400`.

- **Pokémon inexistant**
  - Méthode: **POST**
  - URL: `/api/favorites/999999`
  - Headers: `Authorization: Bearer <token>`
  - Attendu: `404`.

### `DELETE /api/favorites/:pokemonId` (protégée)

Retire un favori (via `$pull`).

#### Exemples de requêtes

- **Retirer un favori**
  - Méthode: **DELETE**
  - URL: `/api/favorites/25`
  - Headers: `Authorization: Bearer <token>`
  - Attendu: `200`.

- **ID invalide**
  - Méthode: **DELETE**
  - URL: `/api/favorites/0`
  - Headers: `Authorization: Bearer <token>`
  - Attendu: `400`.

---

## Routes — Statistiques (6.B)

### `GET /api/stats`

Retourne, via agrégation MongoDB :

- **Nombre de Pokémon par type**
- **Moyenne des HP par type**
- **Pokémon avec le plus d’attaque**
- **Pokémon avec le plus de HP**

#### Exemples de requêtes

- **Récupérer les statistiques**
  - Méthode: **GET**
  - URL: `/api/stats`
  - Attendu: `200`, objet de la forme :

  ```json
  {
    "parType": [
      { "_id": "Fire", "nombrePokemons": 12, "moyenneHP": 65.3 }
    ],
    "maxAttack": [
      { "id": 150, "base": { "Attack": 110 } }
    ],
    "maxHP": [
      { "id": 242, "base": { "HP": 255 } }
    ]
  }
  ```

---

## Routes — Teams (6.D)

Chaque utilisateur peut créer des équipes de **6 Pokémon max**.

Le modèle `Team` contient :

- `user`: référence User
- `name`: nom de l’équipe
- `pokemons`: tableau de références vers les documents Pokémon (max 6)

> Important
>
> Les routes attendent des **IDs Pokémon numériques** (ex: `[4, 5, 6]`) et les convertissent en `_id` MongoDB via une requête sur `Pokemon.id`.

### `POST /api/teams` (protégée)

Crée une équipe.

- **Body JSON**

```json
{
  "name": "Team Fire",
  "pokemons": [4, 5, 6]
}
```

#### Exemples de requêtes

- **Création valide**
  - Méthode: **POST**
  - URL: `/api/teams`
  - Headers: `Authorization: Bearer <token>`
  - Body:

  ```json
  {
    "name": "Team Fire",
    "pokemons": [4, 5, 6]
  }
  ```

  - Attendu: `201`, équipe créée avec `pokemons` peuplés.

- **Sans name**
  - Méthode: **POST**
  - URL: `/api/teams`
  - Headers: `Authorization: Bearer <token>`
  - Body:

  ```json
  {
    "pokemons": [4]
  }
  ```

  - Attendu: `400`.

- **Plus de 6 pokémons**
  - Méthode: **POST**
  - URL: `/api/teams`
  - Headers: `Authorization: Bearer <token>`
  - Body:

  ```json
  {
    "name": "Too many",
    "pokemons": [1, 2, 3, 4, 5, 6, 7]
  }
  ```

  - Attendu: `400`.

### `GET /api/teams` (protégée)

Liste les équipes de l’utilisateur.

#### Exemples de requêtes

- **Lister les équipes**
  - Méthode: **GET**
  - URL: `/api/teams`
  - Headers: `Authorization: Bearer <token>`
  - Attendu: `200`, tableau d’équipes (éventuellement vide).

### `GET /api/teams/:id` (protégée)

Détail d’une équipe (avec `populate()` des Pokémon).

#### Exemples de requêtes

- **Récupérer une équipe**
  - Méthode: **GET**
  - URL: `/api/teams/<teamId>`
  - Headers: `Authorization: Bearer <token>`
  - Attendu: `200`, équipe avec `pokemons` peuplés.

- **Équipe inexistante**
  - Méthode: **GET**
  - URL: `/api/teams/64b000000000000000000000`
  - Headers: `Authorization: Bearer <token>`
  - Attendu: `404`.

### `PUT /api/teams/:id` (protégée)

Met à jour une équipe (nom et/ou pokémons).

- **Body JSON (exemple)**

```json
{
  "name": "Team Fire v2",
  "pokemons": [4, 37, 58]
}
```

#### Exemples de requêtes

- **Mise à jour complète**
  - Méthode: **PUT**
  - URL: `/api/teams/<teamId>`
  - Headers: `Authorization: Bearer <token>`
  - Body:

  ```json
  {
    "name": "Team Fire v2",
    "pokemons": [4, 37, 58]
  }
  ```

  - Attendu: `200`, équipe mise à jour avec `pokemons` peuplés.

- **Trop de pokémons**
  - Méthode: **PUT**
  - URL: `/api/teams/<teamId>`
  - Headers: `Authorization: Bearer <token>`
  - Body:

  ```json
  {
    "pokemons": [1, 2, 3, 4, 5, 6, 7]
  }
  ```

  - Attendu: `400`.

### `DELETE /api/teams/:id` (protégée)

Supprime une équipe.

#### Exemples de requêtes

- **Supprimer une équipe**
  - Méthode: **DELETE**
  - URL: `/api/teams/<teamId>`
  - Headers: `Authorization: Bearer <token>`
  - Attendu: `200`.


---

## Données / Seed

- Fichier: `data/pokemons.json`
- Script: `npm run seed`
  - Supprime la collection Pokémon puis réinsère les données.

---

## Conseils de tests (Postman/Thunder Client)

1. Lancer MongoDB
2. `npm run seed`
3. `npm run dev`
4. `POST /auth/register`
5. `POST /auth/login` → récupérer `token`
6. Ajouter le header **Authorization** sur les routes protégées :
   - `Authorization: Bearer <token>`

