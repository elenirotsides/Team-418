// TODO: db methods for users
const { ObjectId } = require("mongodb");
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const ratingMethods = require('../data/ratings');
const commentMethods = require('../data/comments');
const gameMethods = require('../data/games');

const exportedMethods = {
    // returns an array of all the users
    // if there are no users, return an empty array
    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find().toArray();
        return userList;
    },

    // gets a user by id, pretty self explanatory
    async getUserById(id) {
        /*
        console.log(ratingMethods);
        console.log(commentMethods);
        console.log(gameMethods);
        console.log(this);
        */
        if (arguments.length != 1) throw "Usage: id";
        if (!ObjectId.isValid(id)) throw "User Id needs to be a valid ObjectId";

        const userCollection = await users();
        const user = await userCollection.findOne({_id: id});
        if (!user) throw "User not found with the given id";
        return user;
    },

    // it adds a user
    async addUser(fName, lName, dName, email, favGames, ratings, comments, ppic) {
        if (arguments.length !== 8) 
            throw "Usage: First name, Last name, Display name, Email, Favorite Games, Ratings, Comments, Profile Pic";
        if (typeof fName !== "string" || !fName.trim()) throw "First name must be a non empty string";
        if (typeof lName !== "string" || !lName.trim()) throw "Last name must be a non empty string";
        if (typeof dName !== "string" || !dName.trim()) throw "Display name must be a non empty string";
        if (typeof email !== "string" || !email.trim()) throw "Email must be a non empty string";
        if (typeof ppic !== "string" || !ppic.trim()) throw "Profile picture storage path must be a non empty string";

        //TODO: Possibly add more email validation

        if (!Array.isArray(favGames)) throw "Favorite games needs to be an array of games";
        if (!Array.isArray(ratings)) throw "Ratings needs to be an array...of ratings, duh";
        if (!Array.isArray(comments)) throw "Comments needs to be an array of comments";

        if (favGames.length > 0) {
            for (let i=0; i<favGames.length; i++) {
                try {
                    await gameMethods.getGameById(favGames[i]);
                } catch (e) {
                    throw e;
                }
            }
        }
        if (ratings.length > 0) {
            for (let i=0; i<ratings.length; i++) {
                try {
                    await ratingMethods.getRatingById(ratings[i]);
                } catch (e) {
                    throw e;
                }
            }
        }
        if (comments.length > 0) {
            for (let i=0; i<comments.length; i++) {
                try {
                    await commentMethods.getCommentById(comments[i]);
                } catch (e) {
                    throw e;
                }
            }
        }

        const newUser = {
            _id: ObjectId(),
            firstName: fName,
            lastName: lName,
            displayName: dName,
            email: email,
            favoriteGames: favGames,
            ratings: ratings,
            comments: comments,
            profilePic: ppic
        };

        const userCollection = await users();
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0)
            throw "Could not create new user object";
        const user = await this.getUserById(newUser._id);
        return user;
    }
};

module.exports = exportedMethods;