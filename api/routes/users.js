const express = require('express');
const router = express.Router();
const validation = require('../data/').validation;
const usersData = require('../data').users;

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

module.exports = router;
