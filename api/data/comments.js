// TODO: db methods for comments
const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;

const userMethods = require('../data/users');
const gameMethods = require('../data/games');
const ratingMethods = require('../data/ratings');


const exportedMethods = {
    // returns an array of all comments
    // if there are no comments, return an empty array
    async getAllComments() {
        const commentCollection = await comments();
        const commentList = await commentCollection.find.toArray();
        return commentList;
    },

    // gets a comment by its id
    async getCommentById(id) {
        if (arguments.length !== 1) throw "Usage: Comment Id";
        if (!ObjectId.isValid(id)) throw "Comment Id needs to be a valid ObjectId";

        const commentCollection = await comments();
        const comment = await commentCollection.findOne({_id: id});
        if (!comment) throw "Comment not found with the given id";
        return comment;
    },

    // a comment is added, woah, also returns the comment too for conveniance
    // date is a date object passed in
    async addComment(userId, gameId, comment, dName, date) {
        // error handling
        if (arguments.length != 5) throw "Usage: User ID, Game ID, Comment, Display Name, Date";
        //if (typeof userId !== "string") throw "User ID needs to be a string";
        //if (typeof gameId !== "string") throw "Game ID needs to be a string";
        if (typeof comment !== "string") throw "Comment needs to be a string";
        if (!comment.trim()) throw "Comment needs to be a non empty string";
        if (typeof dName !== "string" || !dName.trim()) throw "Display name needs to be a non empty string";
        // TODO: check date, pretty stupid that the date object doesnt deal with this tbh

        let user;
        let game;
        
        // even more error handling
        try {
            user = await userMethods.getUserById(userId);
            game = await gameMethods.getGameById(gameId);
        } catch (e) {
            throw e;
        }

        const newComment = {
            _id: ObjectId(),
            userId: userId,
            gameId: gameId,
            comment: comment,
            displayName: dName,
            datePosted: date
        };

        const commentCollection = await comments();
        const insertInfo = await commentCollection.insertOne(newComment);
        if (insertInfo.insertedCount === 0)
            throw "Could not create new comment object";

        // update the user and game comment id list
        let userComments = user.comments;
        let gameComments = game.comments;
        userComments.push(newComment._id);
        gameComments.push(newComment._id);
        user.comments = userComments;
        game.comments = gameComments;
        
        const finalComment = await this.getCommentById(newComment._id);
        return finalComment;
    }
};

module.exports = exportedMethods;