const express = require('express');
const router = express.Router();
const validation = require('../data/').validation;
const usersData = require('../data').users;
const path = require('path');

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
        res.sendFile(path.resolve(user.profilePic));
    } catch (error) {
        res.sendStatus(404);
    }
});

module.exports = router;
