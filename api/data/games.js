// TODO: db methods for games
const mongoCollections = require('../config/mongoCollections');
const games = mongoCollections.games;
const { ObjectId } = require('mongodb');
const { validateGameEid } = require('./validation');

module.exports = {
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

    // get a game by its endpoint id, also returns it
    async getGameByEndpointId(eid) {
        if (arguments.length !== 1) throw "Usage: Game Id";
        eid = validateGameEid(eid);
        const gameCollection = await games();
        const game = await gameCollection.findOne({endpointId: eid});
        return game;
    },

    // adds a game
    // so a game can have no ratings or comments, so those arrays can be empty i think
    async addGame(endpointId) {
        if (arguments.length != 1) throw "Usage: Endpoint Id";
        validateGameEid(endpointId);
        //TODO: maybe validate endpointId by calling the API and checking that 
        // it corresponds to an actual game

        // make the new game object
        const newGame = {
            _id: ObjectId(),
            reviews: [],
            endpointId: endpointId
        };

        // add the new game to the game collection in the database
        const gameCollection = await games();
        const insertInfo = await gameCollection.insertOne(newGame);
        if (insertInfo.insertedCount === 0)
            throw "Could not create new game object";
        const game = await this.getGameById(newGame._id);
        return game;
    },

    async getEndpointIds(gameIds){
        for(const gid of gameIds) if (!ObjectId.isValid(gid)) throw "Game Id needs to be a valid ObjectId";
        const gameCollection = await games();
        return await gameCollection.find({_id: {$in: gameIds}}).project({endpointId: 1}).toArray();
    },

    async removeReviewFromGame(gameId, reviewId){
        if (arguments.length != 2) throw "Usage: gameId, reviewId";
        if (!ObjectId.isValid(gameId)) throw "Game Id needs to be a valid ObjectId";
        if (!ObjectId.isValid(reviewId)) throw "Review Id needs to be a valid ObjectId";
        const gameCollection = await games();
        const updatedInfo = await gameCollection.updateOne({_id: gameId}, {$pull : {
            reviews: reviewId
        }})
        if(updatedInfo.modifiedCount !== 1 ) throw 'could not remove review from game'
    }
};
