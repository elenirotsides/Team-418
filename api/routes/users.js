const express = require('express');
const router = express.Router();
const validation = require('../data/').validation;
const usersData = require('../data').users;
const path = require('path');
const fs = require('fs');
const writeFileSync = fs.writeFileSync;
const profilePictureDirectory = path.resolve('./public/imgs');
const font = path.resolve('./fonts/NewYork.ttf');
const validFileExts = ['.jpg', '.jpeg', '.bmp', '.gif', '.png'];
const maxFileSize = 2 * 1024 * 1024;
const maxFileSizeString = '2MB';
const gm = require('gm').subClass({ imageMagick: true });
const IGDBSessionHandler = require('../IGDB/IGDBSessionHandler');
const { getCachedData, setCachedData, dataKeys } = require('../redis');
const axios = require('axios');

router.get('/profile', async function (req, res) {
    // email comes validated from Google
    let email = req.googleInfo.email;
    {
        try {
            const user = await usersData.getUserByEmail(email);
            res.send(user);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
});

router.get(
    '/profile/favorites',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        // email comes validated from Google
        let email = req.googleInfo.email;
        {
            try {
                const user = await usersData.getUserByEmail(email);
                const favoriteGames = [];
                try {
                    for (const gameId of user.favoriteGames) {
                        const cacheData = await getCachedData(
                            dataKeys.gamesId(gameId)
                        );
                        if (cacheData) {
                            favoriteGames.push(cacheData);
                        } else {
                            const response = await axios(
                                IGDBSessionHandler.instance.igdbAxiosConfig(
                                    'games',
                                    null,
                                    `fields name, cover.url, age_ratings.rating, screenshots.url, summary, involved_companies.company.name, involved_companies.publisher, involved_companies.developer; where id = ${gameId};`
                                )
                            );
                            favoriteGames.push(response.data[0]);
                            setCachedData(
                                dataKeys.gamesId(gameId),
                                response.data[0],
                                3600
                            );
                        }
                    }
                } catch (e) {
                    // if error with IGDB, just dont display favorites
                    console.log(
                        `Failed to load favorite game with id: (${gameId}).`
                    );
                }
                res.send(favoriteGames);
            } catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        }
    }
);

router.get('/picture', async function (req, res) {
    // email field is appended by the google auth middleware, it will be previously validated
    let email = req.googleInfo.email;
    try {
        const user = await usersData.getUserByEmail(email);
        res.sendFile(
            path.resolve(`${profilePictureDirectory}/${user.profilePic}`)
        );
    } catch (error) {
        res.sendStatus(404);
    }
});

function validateFileExt(name) {
    const extStart = name.lastIndexOf('.');
    return validFileExts.includes(name.slice(extStart));
}

function validateFileSize(size) {
    return size < maxFileSize;
}

router.post('/picture', async function (req, res) {
    // email field is appended by the google auth middleware, it will be previously validated
    if (!(req.files && req.files.profilePicture))
        return res.status(400).json({ error: 'No profile picture required.' });
    const profilePicture = req.files.profilePicture;
    const newFileName = `${req.googleInfo.uid}-${profilePicture.name}`;
    const filePath = `${profilePictureDirectory}/${newFileName}`;
    const fileOptions = {
        flag: 'w+',
    };
    if (!validateFileExt(profilePicture.name)) {
        return res.status(400).json({
            error: `Invalid file type, profile picture can only be [${validFileExts.join(
                ', '
            )}]`,
        });
    }
    if (!validateFileSize(profilePicture.size)) {
        return res.status(400).json({
            error: `Invalid file size, profile picture can only be up to ${maxFileSizeString}.`,
        });
    }
    try {
        await writeFileSync(filePath, profilePicture.data, fileOptions);
        await gm(filePath)
            .resize(240, 240)
            .autoOrient()
            .font(font, 32)
            .drawText(50, 50, 'Team 418')
            .write(filePath, function (err) {
                if (err) {
                    console.log(
                        'Error in ImageMagick library, make sure you have it installed.',
                        err
                    );
                }
            });
        await usersData.updateProfilePic(req.googleInfo.email, newFileName);
    } catch (e) {
        console.log('Error in /users/picture', e);
        return res.sendStatus(500);
    }
    res.sendStatus(200);
});

module.exports = router;
