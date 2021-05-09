// TODO: db methods for games
const mongoCollections = require('../config/mongoCollections');
const games = mongoCollections.games;
const { ObjectId } = require('mongodb');

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

    // adds a game
    // so a game can have no ratings or comments, so those arrays can be empty i think
    async addGame(endpointId) {
        if (arguments.length != 1) throw "Usage: Endpoint Id";
        if (!Number.isInteger(endpointId)) throw "Endpoint Id needs to be a number";
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
    }
};
