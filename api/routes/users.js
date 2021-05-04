const express = require('express');
const router = express.Router();
const usersData = require('../data').users;

router.post('/profile', async function (req, res) {
    let email = req.body.email;
    email = 'bsanders@gmail.com';
    try {
        const user = await usersData.getUserByEmail(email);
        res.send(user);
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;
