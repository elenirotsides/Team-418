// TODO: db methods for users
const { ObjectId } = require("mongodb");
const mongoCollections = require('../config/mongoCollections');
const { validateString } = require("./validation");
const users = mongoCollections.users;
const validate = require('./validation');

module.exports = {
    // returns an array of all the users
    // if there are no users, return an empty array
    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find().toArray();
        return userList;
    },

    // gets a user by id, pretty self explanatory
    async getUserById(id) {
        if (arguments.length != 1) throw "Usage: id";
        if (!ObjectId.isValid(id)) throw "User Id needs to be a valid ObjectId";

        const userCollection = await users();
        const user = await userCollection.findOne({_id: id});
        if (!user) throw "User not found with the given id";
        return user;
    },

    // gets a user by email, in case you couldn't tell by the obvious method name
    async getUserByEmail(email) {
        if (arguments.length != 1) throw "Usage: email";
        if (!validate.isGoodEmail(email)) throw "That's not a valid email";
        
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) throw "User not found with the given email";
        return user;
    },

    // it adds a user
    async addUser(fName, lName, dName, email, ppic) {
        if (arguments.length !== 5) 
            throw "Usage: First name, Last name, Display name, Email, Profile Pic";
        if (!validate.validateString(fName)) throw "First name must be a non empty string";
        if (!validate.validateString(lName)) throw "Last name must be a non empty string";
        if (!validate.validateString(dName)) throw "Display name must be a non empty string";
        if (!validate.isGoodEmail(email)) throw "Email must be a non empty string and valid";
        if (!validate.validateString(ppic)) throw "Profile picture storage path must be a non empty string";

        /*
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
        } */

        const newUser = {
            _id: ObjectId(),
            firstName: fName,
            lastName: lName,
            displayName: dName,
            email: email,
            favoriteGames: [],
            ratings: [],
            comments: [],
            profilePic: ppic
        };

        const userCollection = await users();
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0)
            throw "Could not create new user object";
        const user = await this.getUserById(newUser._id);
        return user;
    }
}