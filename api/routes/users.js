const express = require('express');
const router = express.Router();
const validation = require('../data/').validation;
const usersData = require('../data').users;
const path = require('path');
const { writeFileSync } = require('fs');
const profilePictureDirectory = path.resolve('./public/imgs');
const validFileExts = ['.jpg', '.jpeg', '.bmp', '.gif', '.png'];
const maxFileSize = 2 * 1024 * 1024;
const maxFileSizeString = '2MB';

router.post('/profile', async function(req, res){
    let email = req.body.email;
    if (!await validation.isGoodEmail(email)){
        res.status(400).send("Invalid email!");
    }else{
        try{
            const user = await usersData.getUserByEmail(email);
            res.send(user);
    
        }catch(error){
            res.status(500).send(error);
        }
    }   

});

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
        await usersData.updateProfilePic(req.googleInfo.email, newFileName);
    } catch (e) {
        console.log('Error in /users/picture', e);
        return res.sendStatus(500);
    }
    res.sendStatus(200);
});

module.exports = router;
