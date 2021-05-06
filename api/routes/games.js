// TODO: add games routes
const express = require('express');
const axios = require('axios');
const router = express.Router();
const gamesData = require('../data').games;
const IGDBSessionHandler = require('../IGDB/IGDBSessionHandler');
const { getCachedData, setCachedData, dataKeys } = require('../redis');

router.get(
    '/',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        try {
            const cacheData = await getCachedData(dataKeys.games);
            if (cacheData) {
                res.json(cacheData);
            } else {
                const response = await axios(
                    IGDBSessionHandler.instance.igdbAxiosConfig(
                        'games',
                        null,
                        'limit 10; offset 0; fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_modes,genres,hypes,involved_companies,keywords,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites;'
                    )
                );
                res.json(response.data);
                setCachedData(dataKeys.games, response.data, 3600);
            }
        } catch (e) {
            console.log(`Error occured in /games/ route`, e);
            res.sendStatus(500);
        }
    }
);

router.get(
    '/popular',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        try {
            const cacheData = await getCachedData(dataKeys.gamesPopular);
            if (cacheData) {
                res.json(cacheData);
            } else {
                const response = await axios(
                    IGDBSessionHandler.instance.igdbAxiosConfig(
                        'games',
                        null,
                        'limit 10; offset 0; fields cover,name,category,total_rating,rating,rating_count; sort rating desc; w cover != null;'
                    )
                );
                
                await getCoversForData(response.data);

                res.json(response.data);
                setCachedData(dataKeys.gamesPopular, response.data, 3600);
            }
        } catch (e) {
            console.log(`Error occured in /games/popular route`, e);
            res.sendStatus(500);
        }
    }
);

router.get(
    '/new',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        try {
            const cacheData = await getCachedData(dataKeys.gamesNew);
            if (cacheData) {
                res.json(cacheData);
            } else {
                const response = await axios(
                    IGDBSessionHandler.instance.igdbAxiosConfig(
                        'games',
                        null,
                        'limit 10; offset 0; fields cover,name,category,total_rating,rating,rating_count; sort release_dates.date desc; w cover != null;'
                    )
                );

                await getCoversForData(response.data);

                res.json(response.data);
                setCachedData(dataKeys.gamesNew, response.data, 3600);
            }
        } catch (e) {
            console.log(`Error occured in /games/new route`, e);
            res.sendStatus(500);
        }
    }
);

router.get(
    '/game/:id',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        const id = req.params.id;
        try {
            const cacheData = await getCachedData(dataKeys.gamesId(id));
            if (cacheData) {
                res.json(cacheData);
            } else {
                const response = await axios(
                    IGDBSessionHandler.instance.igdbAxiosConfig(
                        'games',
                        null,
                        `fields *; where id = ${req.params.id};`
                    )
                );
                res.json(response.data);
                setCachedData(dataKeys.gamesId(id), response.data, 3600);
            }
        } catch (e) {
            console.log(`Error occured in /games/:id route`, e);
            res.sendStatus(500);
        }
    }
);

router.get(
    '/featured',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        const id = req.params.id;
        try {
            const cacheData = await getCachedData(dataKeys.featuredGame);
            if (cacheData) {
                res.json(cacheData);
            } else {
                const response = await axios(
                    IGDBSessionHandler.instance.igdbAxiosConfig(
                        'games',
                        null,
                        `fields *; search "Black Ops Cold War - Season 3";`
                    )
                );

                const responseWithBanner = {
                    igdbData: response.data,
                    banner: '/imgs/featuredCover.png'
                };

                res.json(responseWithBanner);
                setCachedData(dataKeys.featuredGame, responseWithBanner, 3600);
            }
        } catch (e) {
            console.log(`Error occured in /featured`, e);
            res.sendStatus(500);
        }
    }
);

const checkCoverCache = async (req, res, next) => {
    const cacheData = await getCachedData(dataKeys.coverId(req.params.id));
    if (cacheData) {
        res.json({ url: cacheData });
    } else {
        return IGDBSessionHandler.instance.addToRateLimit(req, res, next);
    }
}

router.get(
    '/game/cover/:id',
    IGDBSessionHandler.instance.validateSession(),
    checkCoverCache,
    async function (req, res) {
        const id = req.params.id;
        try {
            if (id != null) {
                const response = await axios(
                    IGDBSessionHandler.instance.igdbAxiosConfig(
                        'covers',
                        null,
                        `fields *; where id = ${id};`
                    )
                );

                res.json({ url: `https://images.igdb.com/igdb/image/upload/t_720p/${response.data[0].image_id}.jpg` });
            }
        } catch (e) {
            console.log(`Error occured in /games/cover/:id route`, e);
            res.sendStatus(500);
        }
    }
);

async function getCoversForData(data) {
    let coverIdString = '';
    for(let i = 0; i < data.length; i++) {
        coverIdString += `${data[i].cover}`;
        if (i < data.length-1) {
            coverIdString += ', '
        }
    };

    const covers = await axios(
        IGDBSessionHandler.instance.igdbAxiosConfig(
            'covers',
            null,
            `fields *; where id = (${coverIdString});`
        )
    );

    for (let i = 0; i < data.length; i++) {
        
        await setCachedData(
             dataKeys.coverId(covers.data[i].id),
            `https://images.igdb.com/igdb/image/upload/t_720p/${covers.data[i].image_id}.jpg`,
            86400);
    }
}

router.post(
    '/search',
    IGDBSessionHandler.instance.validateSession(),
    async function (req, res) {
        const searchTerm = req.body.searchTerm;
        if (!searchTerm)
            return res.status(400).json({ error: 'No search term provided' });

        try {
            const cacheData = await getCachedData(
                dataKeys.gamesSearch(searchTerm)
            );
            if (cacheData) return res.json(cacheData);
            const { data } = await axios(
                IGDBSessionHandler.instance.igdbAxiosConfig(
                    'games',
                    null,
                    `fields name, cover, summary; search "${searchTerm}";`
                )
            );
            res.json(data);
            setCachedData(dataKeys.gamesSearch(searchTerm), data);
        } catch (e) {
            console.log(`Error occured in /games/search route`, e);
            res.sendStatus(500);
        }
    }
);

module.exports = router;
