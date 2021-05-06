const express = require('express');
const router = express.Router();
const validation = require('../data/').validation;
const usersData = require('../data').users;
const { ObjectId } = require("mongodb");


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

router.post('/addfavorites', async function(req, res){
    let userId = req.body.userId;
    let gameList = req.body.gameList;

    let objId = new ObjectId(userId)
    if (!ObjectId.isValid(objId)){
        res.status(400).send("Invalid Object ID!");
    }
    try{
        let favorites = await usersData.addFavorites(userId, gameList);
        res.send(favorites);

    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }

});

module.exports = router;
