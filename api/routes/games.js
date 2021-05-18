// TODO: add games routes
const express = require('express');
const axios = require('axios');
const router = express.Router();
const gamesData = require('../data').games;
const IGDBSessionHandler = require('../IGDB/IGDBSessionHandler');
const { getCachedData, setCachedData, dataKeys } = require('../redis');
const { validateGameEid, validateString, validatePosInt, validateNonNegInt } = require('../data/validation');

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
                        'limit 10; offset 0; fields cover.url, name, screenshots, age_ratings; sort aggregated_rating desc; w cover != null & summary != null & screenshots != null & age_ratings != null & first_release_date > 1577856121 & total_rating_count > 20 & platforms.category = (1,6);'
                    )
                );

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
                        'limit 10; offset 0; fields cover.url, name; sort first_release_date desc; w cover != null & summary != null & screenshots != null & age_ratings != null & first_release_date > 1577856121 & total_rating_count > 20 & platforms.category = (1,6);'
                    )
                );

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
    '/allpopular',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        try {

            const response = await axios(
                IGDBSessionHandler.instance.igdbAxiosConfig(
                    'games',
                    null,
                    'limit 12; offset 0; fields cover.url, name, screenshots, age_ratings; sort aggregated_rating desc; w cover != null & summary != null & screenshots != null & age_ratings != null & first_release_date > 1577856121 & total_rating_count > 20 & platforms.category = (1,6);'
                    )
            );

            res.json(response.data);
            //setCachedData(dataKeys.gamesPopular, response.data, 3600);

        } catch (e) {
            console.log(`Error occured in /games/allpopular route`, e);
            res.sendStatus(500);
        }
    }
);

router.get(
    '/allnew',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        try {

            const response = await axios(
                IGDBSessionHandler.instance.igdbAxiosConfig(
                    'games',
                    null,
                    'limit 12; offset 0; fields cover.url, name; sort first_release_date desc; w cover != null & summary != null & screenshots != null & age_ratings != null & first_release_date > 1577856121 & total_rating_count > 20 & platforms.category = (1,6);'
                    )
            );

            res.json(response.data);
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
            validateGameEid(id);
        } catch (e) {
            return res.status(400).json({ error: e });
        }
        try {
            const cacheData = await getCachedData(dataKeys.gamesId(id));
            if (cacheData) {
                res.json(cacheData);
            } else {
                console.log('no cached data for /games/:id');

                const response = await axios(
                    IGDBSessionHandler.instance.igdbAxiosConfig(
                        'games',
                        null,
                        `fields name, cover.url, age_ratings.rating, screenshots.url, summary, genres.name, platforms.name, platforms.platform_logo.url, game_modes.name, player_perspectives.name, themes.name, websites.category, websites.url, category, first_release_date, involved_companies.company.name, involved_companies.publisher, involved_companies.developer; where id = ${req.params.id};`
                    )
                );

                res.json(response.data[0]);
                setCachedData(dataKeys.gamesId(id), response.data[0], 3600);
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

router.post(
    '/search/:pageNum',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        const searchTerm = req.body.searchTerm;
        if (!searchTerm || !validateString(searchTerm))
            return res.status(400).json({ error: 'No search term provided' });
        if (!validateNonNegInt(req.params.pageNum))
            return res
                .status(400)
                .json({ error: 'Page num must be non-negative.' });
        if (req.body && req.body.genres && !validatePosInt(req.body.genres))
            return res
                .status(400)
                .json({ error: 'Genre must be a positive integer.' });
        if (req.body && req.body.platforms && !validatePosInt(req.body.platforms))
            return res
                .status(400)
                .json({ error: 'Platform must be a positive integer.' });
        try {
            let fieldString = `limit 12; offset ${req.params.pageNum * 12}; fields name, cover.url, genres; search "${searchTerm}";`;
            let advancedFields = '';
            for (const key of ['genres', 'platforms']) {
                if (req.body.hasOwnProperty(key))
                    advancedFields +=
                        (advancedFields ? ' &' : ' ') +
                        `${key}=${req.body[key]}`;
            }
            if (advancedFields) fieldString += `where ${advancedFields};`;
            const cacheData = await getCachedData(
                dataKeys.gamesSearch(fieldString)
            );
            if (cacheData) return res.json(cacheData);
            const { data } = await axios(
                IGDBSessionHandler.instance.igdbAxiosConfig(
                    'games',
                    null,
                    fieldString
                )
            );
            res.json(data);
            setCachedData(dataKeys.gamesSearch(fieldString), data);
        } catch (e) {
            console.log(`Error occured in /games/search/:pageNum route`, e);
            res.sendStatus(500);
        }
    }
);

async function getGameGenres() {
    const cacheData = await getCachedData(dataKeys.gamesGenres);
    if (cacheData) return cacheData;
    const { data } = await axios(
        IGDBSessionHandler.instance.igdbAxiosConfig(
            'genres',
            null,
            `fields name;`
        )
    );
    setCachedData(dataKeys.gamesGenres, data);
    return data;
}

function getGamePlatforms() {
    // IGBD has a ridiculous set of systems,
    // this will work for now
    return [
        { id: 5, name: 'Wii' },
        { id: 9, name: 'PlayStation 3' },
        { id: 12, name: 'Xbox 360' },
        { id: 41, name: 'Wii U' },
        { id: 48, name: 'PlayStation 4' },
        { id: 49, name: 'Xbox One' },
        { id: 130, name: 'Nintendo Switch' },
        { id: 167, name: 'PlayStation 5' },
        { id: 169, name: 'Xbox Series' },
    ];
}

router.get(
    '/search/info',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        try {
            const cacheData = await getCachedData(dataKeys.gamesSearchInfo);
            if (cacheData) return res.json(cacheData);
            const data = {
                genres: await getGameGenres(),
                platforms: getGamePlatforms(),
            };
            res.json(data);
            setCachedData(dataKeys.gamesSearchInfo, data);
        } catch (e) {
            console.log(`Error occured in /games/search/info route`, e);
            res.sendStatus(500);
        }
    }
);

module.exports = router;
