// TODO: add ratings routes
const express = require('express');
const router = express.Router();

const { ObjectId } = require('mongodb');

const ratingsData = require('../data').ratings;

router.post('/retrieve', async function(req, res){
    let userId = req.body.userId;
    let objId = new ObjectId(userId)
    if (!ObjectId.isValid(objId)){
        res.status(400).send("Invalid Object ID!");
    }
    try{
        let ratings = await ratingsData.getAllRatingsByUserId(objId);
        console.log(ratings);
        res.send(ratings);

    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
    
});


module.exports = router;
