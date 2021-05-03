// TODO: add ratings routes
const express = require('express');
const router = express.Router();

const ratingsData = require('../data').ratings;

router.post('/retrieve', async function(req, res){
    let userId = req.body.userId;
    try{
        let ratings = await ratingsData.getAllRatingsByUserId(userId);
        res.send(ratings);

    }catch(error){
        console.log(error);
        res.send(error);
    }
    
});


module.exports = router;
