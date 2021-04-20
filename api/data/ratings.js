// TODO: db methods for ratings
const mongoCollections = require('../config/mongoCollections');

const ratings = mongoCollections.ratings;
const users = mongoCollections.users;
const games = mongoCollections.games;
const { ObjectId } = require('mongodb');

const userMethods = require('../data/users.js');
const gameMethods = require('../data/games');

module.exports = {
    // return an array of all ratings
    // no ratings returns an empty array
    async getAllRatings() {
        const ratingCollection = await ratings();
        const ratingList = await ratingCollection.find.toArray();
        return ratingList;
    },

    //get a rating by its id
    async getRatingById(id) {
        if (arguments.length !== 1) throw "Usage: Rating Id";
        if (!ObjectId.isValid(id)) throw "Rating Id needs to be a valid ObjectId";

        const ratingCollection = await ratings();
        const rating = await ratingCollection.findOne({_id: id});
        if (!rating) throw "Rating not found with the given id";
        return rating;
    },

    // meh, just adds a rating, also returns it
    // i don't think these comments are actually helping anyone
    // date is a date object passed in
    async addRating(userId, gameId, rating, date) {
        // error handling
        if (arguments.length != 4) throw "Usage: User ID, Game ID, Rating, Date";
        //if (!ObjectId.isValid(userId)) throw "User ID needs to be a string";
        //if (typeof gameId !== "string") throw "Game ID needs to be a string";

        // yea i know this doesn't cover the case where it has a 0 as a decimal value
        // but it doesn't really break the program so i'm not checking for it
        if (!Number.isInteger(rating) || rating < 1 || rating > 10)
            throw "Rating needs to be a positive integer from 1-10";
        //if (typeof dName !== "string" || !dName.trim()) throw "Display name needs to be a non empty string";
        // TODO: check date, pretty stupid that the date object doesnt deal with this tbh 
        
        // check that the userId and gameId actually belong to corresponding objects
        let user;
        let game;
        try {
            user = await userMethods.getUserById(userId);
            game = await gameMethods.getGameById(gameId);
        } catch (e) {
            throw e;
        }

        // make the new rating object
        const newRating = {
            _id: ObjectId(),
            userId: userId,
            gameId: gameId,
            rating: rating,
            displayName: user.displayName,
            datePosted: date
        };

        // adding the rating to the rating collection in the database
        const ratingCollection = await ratings();
        const insertInfo = await ratingCollection.insertOne(newRating);
        if (insertInfo.insertedCount === 0)
            throw "Could not create new rating object";

        // update the user and game rating id list
        let userRatings = user.ratings;
        let gameRatings = game.ratings;
        userRatings.push(newRating._id);
        gameRatings.push(newRating._id);

        const newUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            email: user.email,
            favoriteGames: user.favoriteGames,
            ratings: userRatings,
            comments: user.comments,
            profilePic: user.profilePic
        };

        const userCollection = await users();
        const gameCollection = await games();
        
        const userUpdate = await userCollection.updateOne({_id: userId}, {$set: newUser});
        if (userUpdate.modifiedCount === 0)
            throw "Could not modify user with new rating";

        const newGame = {
            ratings: gameRatings,
            comments: game.comments,
            endpointId: game.endpointId
        };
        const gameUpdate = await gameCollection.updateOne({_id: gameId}, {$set: newGame});
        if (gameUpdate.modifiedCount === 0)
            throw "Could not modify game with new rating";

        const finalRating = await this.getRatingById(newRating._id);
        return finalRating;
    }
};

