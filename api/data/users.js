// TODO: db methods for users
const { ObjectId } = require("mongodb");
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const validate = require('./validation');
const fs = require('fs');

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
        const user = await userCollection.findOne({_id: ObjectId(id)});
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

    // checks if user already exists since emails are unique 
    async userAlreadyExists(email) {
        if (arguments.length !== 1) throw "Usage: Email";
        if (!validate.isGoodEmail(email)) throw "Email needs to be legit, that ain't legit";
        try {
            await this.getUserByEmail(email);
            return true;
        } catch (e) {
            return false;
        }
    },

    // checks if a disply name is already taken, returns true if so
    async isDisplayNameTaken(dName) {
        if (arguments.length !== 1) throw "Usage: Display name";
        if (!validate.validateString(dName)) throw "Display name must be a non empty string";
        
        const userCollection = await users();
        const user = await userCollection.findOne({displayName: dName});
        if (!user) return false;
        return true;
    },

    // it adds a user
    async addUser(fName, lName, dName, email) {
        if (arguments.length !== 4) 
            throw "Usage: First name, Last name, Display name, Email";
        if (!validate.validateString(fName)) throw "First name must be a non empty string";
        if (!validate.validateString(lName)) throw "Last name must be a non empty string";
        if (!validate.validateString(dName)) throw "Display name must be a non empty string";
        if (!validate.isGoodEmail(email)) throw "Email must be a non empty string and valid";

        // check that the user doesn't already exist
        if (await this.userAlreadyExists(email)) throw "Another user has taken this email";

        // check that the display name is unique and doesn't already exist in the database
        if (await this.isDisplayNameTaken(dName)) 
            throw "That display name is already taken, how unfortunate for you";

        const newUser = {
            _id: ObjectId(),
            firstName: fName,
            lastName: lName,
            displayName: dName,
            email: email,
            favoriteGames: [],
            reviews: [],
            profilePic: "profile.png",
            status: "Status not set"
        };

        const userCollection = await users();
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0)
            throw "Could not create new user object";
        const user = await this.getUserById(newUser._id);
        return user;
    },
    
    // updates a given users profile pic assuming the image link is valid?
    // how/where is the image being stored??
    async updateProfilePic(email, link) {
        if (arguments.length !== 2) throw "Usage: User Id, Image link";

        let user;
        try {
            user = await this.getUserByEmail(email);
        } catch (e) {
            throw e;
        }

        if (!validate.validateString(link)) throw "Well the link should be a non empty string";

        // prevents error if you try to upload a file with the same name
        if(user.profilePic === link) return true;

        const newUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            email: user.email,
            favoriteGames: user.favoriteGames,
            reviews: user.reviews,
            profilePic: link
        };

        const userCollection = await users();
        const userUpdate = await userCollection.updateOne({_id: user._id}, {$set: newUser});
        if (userUpdate.modifiedCount === 0)
            throw "Could not modify user with new profile pic";
        return userUpdate;

    },

    // add favorite games to the user
    // gameList is an array of endpoint ids
    // allows duplicates in the input, but the code will ensure fav games are all unique
    // returns the favorite games array
    async addFavorites(userId, gameList) {
        if (arguments.length != 2) throw "Usage: User Id, Game List";
        if (!Array.isArray(gameList)) throw "Game List needs to be a non-empty array";
        if (gameList.length === 0) 
            throw "Why...why would you pass in an empty array, you're just wasting everyone's time here";
        
        // check that every element in the array is at least a non empty string
        for (let i=0; i<gameList.length; i++) {
            if (!validate.validateString(gameList[i]))
                throw "All elements should be non-empty strings";
        }

        let user;
        try {
            user = await this.getUserById(userId);
        } catch (e) {
            throw e;
        }

        let updatedList = user.favoriteGames;
        for (let i=0; i<gameList.length; i++) {
            if (!updatedList.includes(gameList[i]))
                updatedList.push(gameList[i]);
        }

        const newUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            email: user.email,
            favoriteGames: updatedList,
            reviews: user.reviews,
            profilePic: user.profilePic
        };

        const userCollection = await users();
        const userUpdate = await userCollection.updateOne({_id: user._id}, {$set: newUser});
        if (userUpdate.modifiedCount === 0)
            throw "Could not modify user with new favorite games";
        return updatedList;

    }, 

    //remove favorite games from a user
    // can supply any valid endpoint id, code will remove those that exist in fav games
    // returns the updated favorite games array
    async removeFavorites(userId, gameList) {
        if (arguments.length != 2) throw "Usage: User Id, Game List";
        if (!Array.isArray(gameList)) throw "Game List needs to be a non-empty array";
        if (gameList.length === 0) 
            throw "Why...why would you pass in an empty array, you're just wasting everyone's time here";
        
        // check that every element in the array is at least a non empty string
        for (let i=0; i<gameList.length; i++) {
            if (!validate.validateString(gameList[i]))
                throw "All elements should be non-empty strings";
        }

        let user;
        try {
            user = await this.getUserById(userId);
        } catch (e) {
            throw e;
        }

        let updatedList = user.favoriteGames;
        for (let i=0; i<gameList.length; i++) {
            //https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
            let index = updatedList.indexOf(gameList[i]);
            if (index > -1)
                updatedList.splice(index, 1);
        }

        const newUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            email: user.email,
            favoriteGames: updatedList,
            reviews: user.reviews,
            profilePic: user.profilePic
        };

        const userCollection = await users();
        const userUpdate = await userCollection.updateOne({_id: user._id}, {$set: newUser});
        if (userUpdate.modifiedCount === 0)
            throw "Could not modify user with removed favorite games";
        return updatedList;
    },

    async removeReviewFromUser(userId, reviewId){
        if (arguments.length !== 2) throw "Usage: userId, reviewId";
        if (!ObjectId.isValid(userId)) throw "User Id needs to be a valid ObjectId";
        if (!ObjectId.isValid(reviewId)) throw "Review Id needs to be a valid ObjectId";
        const userCollection = await users();
        const updatedInfo = await userCollection.updateOne({_id: userId}, {$pull : {
            reviews: reviewId
        }})
        if(updatedInfo.modifiedCount !== 1 ) throw 'could not remove review from user'
    },

    async getStatus(userEmail){
        if(arguments.length !== 1) throw "Usage: userEmail";
        if(!validate.isGoodEmail(userEmail)) throw "userEmail must be a valid email";

        user = await this.getUserByEmail(userEmail)
        return user.status
    },

    async editStatus(userEmail, status){
        if (arguments.length !== 2) throw "Usage: userEmail, status";
        if (!validate.isGoodEmail(userEmail)) throw "userEmail must be a valid email"
        if (!validate.validateString(status)) throw "Status must be a non empty string";

        const userCollection = await users();
        const updateInfo = await userCollection.updateOne({email: userEmail}, {$set: {status: status}});
        if (updateInfo.modifiedCount !== 1) throw "Could not update status"

        return await this.getStatus(userEmail)
    }
}
