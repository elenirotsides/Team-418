// TODO: add users routes
const express = require('express');
const router = express.Router();
const usersData = require('../data').users;

/*router.post('/signup', async function(req, res){
    let firstName = req.query.firstName;
    let lastName = req.query.lastName;
    let email = req.query.email;
    
    try{
        let user = await usersData.addUser(firstName, lastName);
        res.send("Successful!");
    }catch(error){
        res.send(error);
    }
    


});*/

router.get('/profile/:email', async function(req, res){
    let email = req.params.email;
    try{
        const user = await usersData.getUserByEmail(email);
        res.send(user);

    }catch(error){
        res.send(error);
    }

});


module.exports = router;
