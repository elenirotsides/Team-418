const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;
const users = mongoCollections.users;
const games = mongoCollections.games;

const userMethods = require('../data/users');
const gameMethods = require('../data/games');
const validate = require('./validation');
const { validateGameEid, validateString, validateDate, validateRating, isGoodEmail } = require('./validation');

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
            throw 'User Id needs to be a valid ObjectId';

        const reviewCollection = await reviews();
        const userReviews = await reviewCollection.find({ userId: id }).toArray();
        return userReviews;
    },

    //gets all reviews based on email
    async getAllReviewsByEmail(email) {
        if (arguments.length !== 1) throw 'Usage: User Email';
        if (!isGoodEmail(email)) throw 'Invalid Email';
        const user = await userMethods.getUserByEmail(email);
        const userReviews = await this.getAllReviewsByUserId(user._id);
        return userReviews;
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
        if (!isGoodEmail(email)) throw 'Invalid email';
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
    async addReview(email, gameEid, rating, comment) {
        if (arguments.length !== 4 && arguments.length !== 5)
            throw 'Usage: User Email, Game Endpoint Id, Rating, Date, (Optional) Comment';
        if (!validateRating(rating))
            throw 'Rating needs to be a positive integer from 1-10';
        if (comment && !validate.validateString(comment))
            throw 'If you supply a comment, its gotta be a non empty string';
        validateGameEid(gameEid);
        if(!isGoodEmail(email)) throw 'Invalid email';

        let word = '';
        if (comment) word = comment;

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
            username: `${user.firstName} ${user.lastName}`,
            gameId: game._id,
            rating: rating,
            comment: word,
            datePosted: Date.now(),
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
    async updateRating(reviewId, newRating) {
        if (arguments.length != 2 && arguments.length != 3)
            throw 'Usage: Review Id, New Rating, OPTIONAL PARAMTER: Date';
        let objId = new ObjectId(reviewId);
        if (!ObjectId.isValid(objId)) throw 'Invalid review id';
        if (!validateRating(newRating))
            throw 'Rating needs to be a positive integer from 1-10';

        // retrive review object
        let review;
        try {
            review = await this.getReviewById(reviewId);
        } catch (e) {
            throw e;
        }

        const changedReview = {
            _id: review._id,
            userId: review.userId,
            gameId: review.gameId,
            rating: newRating,
            comment: review.comment,
            username: review.username,
            datePosted: Date.now(),
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
    async updateComment(reviewId, newComment) {
        if (arguments.length != 2 && arguments.length != 3)
            throw 'Usage: Review Id, New Comment, OPTIONAL PARAMTER: Date';
        let objId = new ObjectId(reviewId);
        if (!ObjectId.isValid(objId)) throw 'Invalid review id';
        if (!validate.validateString(newComment))
            throw 'New Comment needs to be a non-empty string';

        // retrive review object
        let review;
        try {
            review = await this.getReviewById(reviewId);
        } catch (e) {
            throw e;
        }

        const changedReview = {
            _id: review._id,
            userId: review.userId,
            gameId: review.gameId,
            rating: review.rating,
            comment: newComment,
            username: review.username,
            datePosted: Date.now(),
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
    async updateReview(reviewId, rating, comment) {
        if (arguments.length != 3 && arguments.length != 4)
            throw 'Usage: Review Id, New Comment, OPTIONAL PARAMTER: Date';
        let objId = new ObjectId(reviewId);
        if (!ObjectId.isValid(objId)) throw 'Invalid review id';
        if (!validateRating(rating))
            throw 'Invalid rating, must be an integer from 1-10.';
        if (comment && !validate.validateString(comment))
            throw 'New Comment needs to be a non-empty string';

        let finalReview;
        try {
            await this.updateRating(reviewId, rating);
            finalReview = await this.updateComment(reviewId, comment);
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
    
    async deleteReviewById(reviewId){
        if (arguments.length !== 1) throw 'Usage: Review Id';
        if (!ObjectId.isValid(reviewId)) throw 'Review Id needs to be a valid ObjectId';
        const review = await this.getReviewById(reviewId);
        const reviewsCollection = await reviews();

        // delete review from reviews collection
        const deletedInfo = await reviewsCollection.deleteOne({_id: reviewId});
        if(deletedInfo.deletedCount !== 1) throw 'could not delete review'

        // delete review from user
        await userMethods.removeReviewFromUser(review.userId, review._id);

        // delete review from game
        await gameMethods.removeReviewFromGame(review.gameId, review._id);
    }
};
