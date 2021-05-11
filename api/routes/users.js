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

module.exports = router;
