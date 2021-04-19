// TODO: db methods for games
const mongoCollections = require('../config/mongoCollections');
const games = mongoCollections.games;
const { ObjectId } = require('mongodb');

const userMethods = require('../data/users');
const ratingMethods = require('../data/ratings');
const commentMethods = require('../data/comments');

const exportedMethods = {
    // you know what this does
    async getAllGames() {
        const gameCollection = await games();
        const gameList = await gameCollection.find.toArray();
        return gameList;
    },

    // get a game by its id, also returns it
    async getGameById(id) {
        if (arguments.length !== 1) throw "Usage: Game Id";
        if (!ObjectId.isValid(id)) throw "Game Id needs to be a valid ObjectId";

        const gameCollection = await games();
        const game = await gameCollection.findOne({_id: id});
        if (!game) throw "Game not found with the given id";
        return game;
    },

    // adds a game
    // so a game can have no ratings or comments, so those arrays can be empty i think
    async addGame(ratings, comments, endpointId) {
        if (arguments.length != 3) throw "Usage: Ratings, Comments, Endpoint Id";
        if (!Array.isArray(ratings)) throw "Ratings needs to be an array of rating ids";
        if (ratings.length > 0) {
            for (let i=0; i<ratings.length; i++) {
                try {
                    await ratingMethods.getRatingById(ratings[i]);
                } catch (e) {
                    throw e;
                }
            }
        }
        if (!Array.isArray(comments)) throw "Comments needs to be an array";
        if (comments.length > 0) {
            for (let i=0; i<comments.length; i++) {
                try {
                    await commentMethods.getCommentById(comments[i]);
                } catch (e) {
                    throw e;
                }
            }
        }

        if (!Number.isInteger(endpointId)) throw "Endpoint Id needs to be a number";
        //TODO: validate endpointId by calling the API and checking that 
        // it corresponds to an actual game

        // make the new game object
        const newGame = {
            _id: ObjectId(),
            ratings: ratings,
            comments: comments,
            endpointId: endpointId
        };

        // add the new game to the game collection in the database
        const gameCollection = await games();
        const insertInfo = await gameCollection.insertOne(newGame);
        if (insertInfo.insertedCount === 0)
            throw "Could not create new game object";
        const game = await this.getGameById(newGame._id);
        return game;
    }
};

module.exports = exportedMethods;