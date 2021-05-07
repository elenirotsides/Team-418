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
                console.log('returning cached data for /games');
                res.json(cacheData);
            } else {
                console.log('no cached data for /games');
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
                console.log('returning cached data for /games/popular');
                res.json(cacheData);
            } else {
                console.log('no cached data for /games/popular');
                const response = await axios(
                    IGDBSessionHandler.instance.igdbAxiosConfig(
                        'games',
                        null,
                        'limit 10; offset 0; fields cover.url, name, screenshots, age_ratings; sort rating desc; w cover != null & summary != null & screenshots != null & age_ratings != null & first_release_date > 1577856121 & total_rating_count > 100;'
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
                console.log('returning cached data for /games/new');
                res.json(cacheData);
            } else {
                console.log('no cached data for /games/new');
                const response = await axios(
                    IGDBSessionHandler.instance.igdbAxiosConfig(
                        'games',
                        null,
                        'limit 10; offset 0; fields cover.url, name; sort release_dates.date desc; w cover != null & summary != null & screenshots != null & age_ratings != null & first_release_date > 1577856121 & total_rating_count > 100;'
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
    '/game/:id',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        const id = req.params.id;
        try {
            const cacheData = await getCachedData(dataKeys.gamesId(id));
            if (cacheData) {
                console.log('returning cached data for /games/:id');
                res.json(cacheData);
            } else {
                console.log('no cached data for /games/:id');

                const response = await axios(
                    IGDBSessionHandler.instance.igdbAxiosConfig(
                        'games',
                        null,
                        `fields name, cover.url, age_ratings.rating, screenshots.url, summary; where id = ${req.params.id};`
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
        const id = req.params.id;
        try {
            const cacheData = await getCachedData(dataKeys.featuredGame);
            if (cacheData) {
                console.log('returning cached data for /games/:id');
                res.json(cacheData);
            } else {
                console.log('no cached data for /featured');
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


module.exports = router;
