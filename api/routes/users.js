const express = require('express');
const router = express.Router();
const validation = require('../data/').validation;
const usersData = require('../data').users;
const reviewsData = require('../data').reviews;
const gamesData = require('../data').games;
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
const { ObjectId } = require('mongodb');

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

// getting the profile page of a different user
router.get('/profile/other/:userId', async function (req, res) {
    let email = req.googleInfo.email;
    let userId = req.params.userId;
    try {
        const user = await usersData.getUserById(userId);
        const currentUser = await usersData.getUserByEmail(email);
        let one = currentUser._id.toString();
        let two = user._id.toString();
        if (one == two) {
            res.send({edge: 'same user'})
            return;
        }
        res.send(user);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);    
    }
});

router.get(
    '/profile/favorites',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        // email comes validated from Google
        let email = req.googleInfo.email;
        let str = '(';
        {
            try {
                const user = await usersData.getUserByEmail(email);
                const favoriteGames = [];
                try {
                    for (const gameId of user.favoriteGames)
                        str = str.concat(gameId, ', ');

                    str = str.slice(0, -2);
                    str = str.concat(')');
                    let gameId = str;

                    const response = await axios(
                        IGDBSessionHandler.instance.igdbAxiosConfig(
                            'games',
                            null,
                            `fields name, cover.url, age_ratings.rating, screenshots.url, summary, involved_companies.company.name, involved_companies.publisher, involved_companies.developer; where id = ${gameId};`
                        )
                    );
                    for (let i=0; i<response.data.length; i++)
                            favoriteGames.push(response.data[i]);

                } catch (e) {
                    // if error with IGDB, just dont display favorites
                    console.log(
                        `Failed to load favorite games`
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

router.get(
    '/profile/favorites/:userId',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        // email comes validated from Google
        let email = req.googleInfo.email;
        let userId = req.params.userId;
        let str = '(';
        {
            try {
                const user = await usersData.getUserById(userId);
                const currentUser = await usersData.getUserByEmail(email);
                const favoriteGames = [];
                try {
                    for (const gameId of user.favoriteGames) 
                        str = str.concat(gameId, ', ');
                    
                    str = str.slice(0, -2);
                    str = str.concat(')');
                    let gameId = str;

                    const response = await axios(
                        IGDBSessionHandler.instance.igdbAxiosConfig(
                            'games',
                            null,
                            `fields name, cover.url, age_ratings.rating, screenshots.url, summary, involved_companies.company.name, involved_companies.publisher, involved_companies.developer; where id = ${gameId};`
                        )
                    );
                    for (let i=0; i<response.data.length; i++)
                            favoriteGames.push(response.data[i]);
                } catch (e) {
                    // if error with IGDB, just dont display favorites
                    console.log(
                        `Failed to load favorite games.`
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

router.post(
    '/profile/status',
    async function(req, res) {
        if (!req.body ||  !req.body.status) {
            return res.status(400).json('Cannot update without a status update. Must also be non empty.'); 
        }
        if (typeof req.body.status !== 'string') {
            return res.status(400).json('Status must be a string.'); 
        }
        let userEmail = req.googleInfo.email;
        let newStatus = req.body.status;
        try {
            const response = await usersData.editStatus(userEmail, newStatus);
            res.status(200).json(response); 
        } catch(e) {
            console.log(e);
            res.status(500).send(e);
        }
    }
)

router.get(
    '/profile/reviews',
    IGDBSessionHandler.instance.validateSession(),
    IGDBSessionHandler.instance.addToRateLimit,
    async function (req, res) {
        try {
            // email comes validated from Google
            let email = req.googleInfo.email;

            // check if user if viewing another user's profile
            const userId = ObjectId(req.query.userId);
            if(req.query.userId && ObjectId.isValid(userId)){
                let user = await usersData.getUserById(userId);
                email = user.email;
            }

            const reviews = await reviewsData.getAllReviewsByEmail(email);
            // no reviews, send 404
            if (reviews.length == 0) return res.sendStatus(404);
            const gameIds = reviews.map((r) => {
                return r.gameId;
            });
            const endpointIds = await gamesData.getEndpointIds(gameIds);
            // create map to reconcile our api game ids, IGBD ids, and the titles
            const gidToEidMap = {};
            const eids = [];
            endpointIds.map((e) => {
                gidToEidMap[e._id] = e.endpointId;
                eids.push(e.endpointId);
            });

            // create query string and send request to IGDB
            const strEids = `(${eids.join(', ')})`;
            const { data } = await axios(
                IGDBSessionHandler.instance.igdbAxiosConfig(
                    'games',
                    null,
                    `fields name; where id = ${strEids};`
                )
            );
            // create final review objects to send to frontend
            const eidToTitleMap = {};
            data.map((d) => (eidToTitleMap[d.id] = d.name));
            for (const review of reviews) {
                let gid = review['gameId'];
                let eid = gidToEidMap[gid];
                review['title'] = eidToTitleMap[eid];
            }
            res.json(reviews);
        } catch (e) {
            console.log('Error in /profile/reviews', e);
            res.sendStatus(500);
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

router.post('/modifyfavorites/:operation', async function(req, res){
    let userId = req.body.userId;
    let gameList = req.body.gameList;
    let operation = req.params.operation;
    let objId = new ObjectId(userId);
    
    if (operation != "add" && operation != "remove"){
        res.status(400).send("Invalid or missing operation type.");
    }
   
    else if (!ObjectId.isValid(objId)){
        res.status(400).send("Invalid Object ID!");
    }
    else if (operation == "add"){
        try{
            let favorites = await usersData.addFavorites(objId, gameList);
            res.send(favorites);
    
        }catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }else{
        try{
            let favorites = await usersData.removeFavorites(objId, gameList);
            res.send(favorites);
    
        }catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }
});
    
router.get('/picture/:userId', async function (req, res) {
    // email field is appended by the google auth middleware, it will be previously validated
    let userId = req.params.userId;
    try {
        const user = await usersData.getUserById(userId);
        res.sendFile(
            path.resolve(`${profilePictureDirectory}/${user.profilePic}`)
        );
    } catch (error) {
        res.sendStatus(404);
    }
});

router.post('/create', async function (req, res) {
    try {
        // throws if no user
        await usersData.getUserByEmail(req.googleInfo.email);
        console.log('User already exists');
        res.sendStatus(200);
    } catch {
        try {
            const name = req.googleInfo.name.split(' ', 2);
            // ugly, but prevents errors where a Google user may have a non-standard name
            const firstName = name[0] || 'First name not provided.';
            const lastName = name[1] || 'Last name not provided.';
            await usersData.addUser(
                firstName,
                lastName,
                req.googleInfo.email,
                req.googleInfo.email
            );
            console.log('User successfully created');
            res.sendStatus(200);
        } catch (e) {
            console.log('Error in /users/create', e);
            res.sendStatus(500);
        }
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
        // write new profile picture to disk
        writeFileSync(filePath, profilePicture.data, fileOptions);
        // update db to point to new profile picture
        await usersData.updateProfilePic(req.googleInfo.email, newFileName);
        gm(filePath)
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
                // the profile picture is still saved, just not formatted by ImageMagick
                res.sendStatus(200);
            });
    } catch (e) {
        console.log('Error in /users/picture', e);
        return res.sendStatus(500);
    }
});

module.exports = router;