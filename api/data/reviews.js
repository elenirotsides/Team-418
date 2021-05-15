const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
const games = mongoCollections.games;

const userMethods = require('../data/users');
const gameMethods = require('../data/games');
const validate = require('./validation');
const { validateGameEid } = require('./validation');

module.exports = {
    // returns an array of all reviews
    // if there are no reviews return an empty array
    async getAllReviews() {
        const reviewCollection = await reviews();
        const reviewList = await reviewCollection.find.toArray();
        return reviewList;
    },

    async getReviewById(id) {
        if (arguments.length !== 1) throw 'Usage: Review Id';
        if (!ObjectId.isValid(id))
            throw 'Review Id needs to be a valid ObjectId';

        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: id });
        if (!review) throw 'Review not found with the given id';
        return review;
    },

    //gets all reviews beloning to a user id
    async getAllReviewsByUserId(id) {
        if (arguments.length !== 1) throw 'Usage: User Id';
        if (!ObjectId.isValid(id))
            throw 'Review Id needs to be a valid ObjectId';

        const reviewCollection = await reviews();
        const reviews = await reviewCollection.find({ userId: id }).toArray();
        return reviews;
    },

    //gets all reviews beloning to a user id
    async getAllGameReviews(gameEid) {
        validateGameEid(gameEid);
        const game = await gameMethods.getGameByEndpointId(gameEid);
        // if the game has not been added to the database, return empty list
        if (!game) return [];
        const reviewCollection = await reviews();
        const gameReviews = await reviewCollection
            .find({ gameId: game._id })
            .toArray();
        return gameReviews;
    },

    async getReviewByEndpointIdAndEmail(gameEid, email) {
        if (arguments.length !== 2) throw 'Usage: Game Endpoint Id, User Email';
        validateGameEid(gameEid);
        // email is validated through google
        const user = await userMethods.getUserByEmail(email);
        let game = await gameMethods.getGameByEndpointId(gameEid);
        // game not found, so no review
        if (!game) return null;
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({
            userId: user._id,
            gameId: game._id,
        });
        return review;
    },

    // it adds a review obviously
    // comment is an optional parameter
    async addReview(email, gameEid, rating, date, comment) {
        if (arguments.length !== 4 && arguments.length !== 5)
            throw 'Usage: User Id, Game Endpoint Id, Rating, Date, (Optional) Comment';
        if (!Number.isInteger(rating) || rating < 1 || rating > 10)
            throw 'Rating needs to be a positive integer from 1-10';
        if (comment && !validate.validateString(comment))
            throw 'If you supply a comment, its gotta be a non empty string';
        validateGameEid(gameEid);

        let word = '';
        if (comment) word = comment;

        // TODO: validate date

        let user;
        let game;
        user = await userMethods.getUserByEmail(email);
        game = await gameMethods.getGameByEndpointId(gameEid);
        if (!game) {
            // create the game if it does not exist
            game = await gameMethods.addGame(gameEid);
        }

        const newReview = {
            _id: ObjectId(),
            userId: user._id,
            gameId: game._id,
            rating: rating,
            comment: word,
            displayName: user.displayName,
            datePosted: date,
        };

        const reviewCollection = await reviews();
        const insertInfo = await reviewCollection.insertOne(newReview);
        if (insertInfo.insertedCount === 0)
            throw 'Could not create new review object';

        // need to update user and game review id lists
        let userReviews = user.reviews;
        let gameReviews = game.reviews;
        userReviews.push(newReview._id);
        gameReviews.push(newReview._id);

        const newUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            email: user.email,
            favoriteGames: user.favoriteGames,
            reviews: userReviews,
            profilePic: user.profilePic,
        };

        const userCollection = await users();
        const gameCollection = await games();

        const userUpdate = await userCollection.updateOne(
            { _id: user._id },
            { $set: newUser }
        );
        if (userUpdate.modifiedCount === 0)
            throw 'Could not modify user with new review';

        const newGame = {
            reviews: gameReviews,
            endpointId: game.endpointId,
        };

        const gameUpdate = await gameCollection.updateOne(
            { _id: game._id },
            { $set: newGame }
        );
        if (gameUpdate.modifiedCount === 0)
            throw 'Could not modify game with new review';

        const finalReview = await this.getReviewById(newReview._id);
        return finalReview;
    },

    // updates the rating of the review only
    // date is an optional parameter
    async updateRating(reviewId, newRating, date = undefined) {
        if (arguments.length != 2 && arguments.length != 3)
            throw 'Usage: Review Id, New Rating, OPTIONAL PARAMTER: Date';

        // retrive review object
        let review;
        try {
            review = await this.getReviewById(reviewId);
        } catch (e) {
            throw e;
        }

        if (!Number.isInteger(newRating) || newRating < 1 || newRating > 10)
            throw 'Rating needs to be a positive integer from 1-10';

        let newDate = review.datePosted;
        if (date) newDate = date;

        const changedReview = {
            _id: review._id,
            userId: review.userId,
            gameId: review.gameId,
            rating: newRating,
            comment: review.comment,
            displayName: review.displayName,
            datePosted: newDate,
        };

        const reviewCollection = await reviews();
        const updateInfo = await reviewCollection.updateOne(
            { _id: reviewId },
            { $set: changedReview }
        );
        if (updateInfo.insertedCount === 0)
            throw 'Could not update review object';
        return changedReview;
    },

    // updates the commment of the review only
    // date is an optional parameter
    async updateComment(reviewId, newComment, date = undefined) {
        if (arguments.length != 2 && arguments.length != 3)
            throw 'Usage: Review Id, New Comment, OPTIONAL PARAMTER: Date';

        // retrive review object
        let review;
        try {
            review = await this.getReviewById(reviewId);
        } catch (e) {
            throw e;
        }

        if (!validate.validateString(newComment))
            throw 'New Comment needs to be a non-empty string';

        let newDate = review.datePosted;
        if (date) newDate = date;

        const changedReview = {
            _id: review._id,
            userId: review.userId,
            gameId: review.gameId,
            rating: review.rating,
            comment: newComment,
            displayName: review.displayName,
            datePosted: newDate,
        };

        const reviewCollection = await reviews();
        const updateInfo = await reviewCollection.updateOne(
            { _id: review._id },
            { $set: changedReview }
        );
        if (updateInfo.insertedCount === 0)
            throw 'Could not update review object';
        return changedReview;
    },

    // updates review with new rating and comment
    // date is an optional parameter
    async updateReview(reviewId, rating, comment, date = undefined) {
        if (arguments.length != 3 && arguments.length != 4)
            throw 'Usage: Review Id, New Comment, OPTIONAL PARAMTER: Date';

        let finalReview;
        try {
            await this.updateRating(reviewId, rating, date);
            finalReview = await this.updateComment(reviewId, comment, date);
            return finalReview;
        } catch (e) {
            throw e;
        }
    },

    async getAverageRating(gameEid) {
        validateGameEid(gameEid);
        const reviewCollection = await reviews();
        const game = await gameMethods.getGameByEndpointId(gameEid);
        // game does not exist
        if (!game) return null;
        return await reviewCollection.aggregate([
            { $match: { gameId: game._id } },
            {
                $group: {
                    _id: '$gameId',
                    count: { $sum: 1 },
                    average: { $avg: '$rating' },
                },
            },
        ]).toArray();
    },
};
