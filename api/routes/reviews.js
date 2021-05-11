const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const reviewsData = require('../data').reviews;
const {validateString} = require('../data/validation');

router.post('/retrieve', async function (req, res) {
    let userId = req.body.userId;
    let objId = new ObjectId(userId);
    if (!ObjectId.isValid(objId)) {
        res.status(400).send('Invalid Object ID!');
    }
    try {
        let reviews = await reviewsData.getAllreviewsByUserId(objId);
        console.log(reviews);
        res.send(reviews);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.post('/', async function (req, res) {
    if (!req.body || !req.body.rating || !req.body.gameId)
        return res.status(400).json({
            error: 'Review must at least contain a rating and the game id.',
        });
    let rating = req.body.rating;
    let gameId = req.body.gameId;
    if (!Number.isInteger(rating) || rating < 0 || rating > 10)
        return res
            .status(400)
            .json({ error: 'Rating must be an integer between 0 and 10.' });
    let comment = req.body.comment;
    if (comment && !validateString(comment))
        return res.status(400).json({
            error: 'If provided, the review comment must be a non-empty string.',
        });
    try {
        await reviewsData.addReview(
            req.googleInfo.email,
            gameId,
            rating,
            Date.now().toLocaleString,
            comment
        );
        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
});

module.exports = router;
