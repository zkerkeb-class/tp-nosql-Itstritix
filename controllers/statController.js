import Pokemon from '../models/pokemon.js';

const statsController = async (req, res, next) => {
    try {
        const stats = await Pokemon.aggregate([
            {
                $facet: {
                    parType: [
                        { $unwind: "$type" },
                        {
                            $group: {
                                _id: "$type",
                                nombrePokemons: { $sum: 1 },
                                moyenneHP: { $avg: "$base.HP" }
                            }
                        },
                        { $sort: { nombrePokemons: -1 } }
                    ],
                    maxAttack: [
                        { $sort: { "base.Attack": -1 } },
                        { $limit: 1 },
                        {
                            $project: {
                                _id: 0,
                                id: 1,
                                name: 1,
                                type: 1,
                                base: 1
                            }
                        }
                    ],
                    maxHP: [
                        { $sort: { "base.HP": -1 } },
                        { $limit: 1 },
                        {
                            $project: {
                                _id: 0,
                                id: 1,
                                name: 1,
                                type: 1,
                                base: 1
                            }
                        }
                    ]
                }
            }
        ]);

        res.status(200).json(stats[0] || { parType: [], maxAttack: [], maxHP: [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { statsController };
