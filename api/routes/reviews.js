const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const reviewsData = require('../data').reviews;
const usersData = require('../data').users;
const { validateString, validateGameEid, validateRating } = require('../data/validation');

router.post('/retrieve', async function (req, res) {
    let userId = req.body.userId;
    let objId = new ObjectId(userId);
    if (!ObjectId.isValid(objId)) {
        return res.status(400).send('Invalid Object ID!');
    }
    try {
        let reviews = await reviewsData.getAllreviewsByUserId(objId);
        res.send(reviews);
    } catch (error) {
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
    try {
        validateGameEid(gameId);
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    if (!validateRating(rating))
        return res
            .status(400)
            .json({ error: 'Rating must be an integer between 0 and 10.' });
    let comment = req.body.comment;
    if (comment && !validateString(comment))
        return res.status(400).json({
            error: 'If provided, the review comment must be a non-empty string.',
        });
    try {
        const oldReview = await reviewsData.getReviewByEndpointIdAndEmail(
            gameId,
            req.googleInfo.email
        );
        if (oldReview) {
            await reviewsData.updateReview(
                oldReview._id,
                rating,
                comment,
                Date.now().toLocaleString()
            );
        } else {
            await reviewsData.addReview(
                req.googleInfo.email,
                gameId,
                rating,
                Date.now().toLocaleString,
                comment
            );
        }
        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
});

router.get('/:gameId', async function (req, res) {
    let gameEid = req.params.gameId;
    try {
        validateGameEid(gameEid);
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    try {
        const reviews = await reviewsData.getAllGameReviews(gameEid);
        if (reviews) {
            res.json(reviews);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.log('Error in /reviews/:gameId/user', e);
        res.sendStatus(500);
    }
});

router.get('/average/:gameId', async function (req, res) {
    let gameEid = req.params.gameId;
    try {
        validateGameEid(gameEid);
    } catch (e) {
        return res.status(400).json({ error: e });
    }
    try {
        const average = await reviewsData.getAverageRating(gameEid);
        if(!average || (Array.isArray(average) && average.length === 0)) return res.sendStatus(404);
        res.json(average[0]);
    } catch (e) {
        console.log('Error in /reviews/:gameId/user', e);
        res.sendStatus(500);
    }
});

router.get('/:gameId/user', async function (req, res) {
    try {
        const gameId = Number.parseInt(req.params.gameId);
        try {
            validateGameEid(gameId);
        } catch (e) {
            return res.status(400).json({ error: e });
        }
        const review = await reviewsData.getReviewByEndpointIdAndEmail(
            gameId,
            req.googleInfo.email
        );
        if (review) {
            res.json(review);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.log('Error in /reviews/:gameId/user', e);
        res.sendStatus(500);
    }
});

router.delete('/:reviewId', async function (req, res) {
    try {
        const reviewId = ObjectId(req.params.reviewId);
        if (!ObjectId.isValid(reviewId)) return res.sendStatus(400);
        const review = await reviewsData.getReviewById(reviewId);
        const currentUser = await usersData.getUserByEmail(
            req.googleInfo.email
        );
        // ensure user is deleting their own review
        if (currentUser._id.toString() !== review.userId.toString())
            return res.sendStatus(401);
        await reviewsData.deleteReviewById(review._id);
        res.sendStatus(200);
    } catch (e) {
        console.log('Error in DELETE /reviews/:gameId/user', e);
        res.sendStatus(500);
    }
});

module.exports = router;
