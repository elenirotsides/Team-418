// TODO: add games routes
const express = require('express');
const axios = require('axios');
const router = express.Router();
const gamesData = require('../data').games;
const IGDBSessionHandler = require('../IGDB/IGDBSessionHandler')

module.exports = router;

router.get('/',
    IGDBSessionHandler.instance.validateSession(),
    async function (req, res) {
        await axios(
            IGDBSessionHandler.instance.igdbAxiosConfig(
                'games',
                null,
                "limit 10; offset 0; fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_modes,genres,hypes,involved_companies,keywords,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites;"))
            .then(response => {
                res.json(response.data);
                //console.log(response);
            }).catch(error => {
                res.json(error);
                console.log(error);
            });
    }
);