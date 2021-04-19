// TODO: add seed

/*
const user = require("../data/userData")
const dbConnection = require("../settings/connections")
const house = require("../data/houseData")
const commentAndReviewData = require("../data/commentAndReviewData");
const reviewData = commentAndReviewData.reviewsDate;
const commentData = commentAndReviewData.commentsData;
const userData = user.users;
const houseData = house.houseData;
const favhouseData = house.favHouseData;
*/

const dbConnection =  require('../config/mongoConnection');
const data = require('../data/index');
const userData = data.users;
const gameData = data.games;
const ratingData = data.ratings;
const commentData = data.comments;

// 5 users, 10 games, 2 comments and ratings for each game

const user1 = {
    firstName: "Bernie",
    lastName: "Sanders",
    displayName: "bsanders15",
    email: "bsanders@gmail.com",
    favoriteGames: [],
    ratings: [],
    comments: [],
    profilePic: "null"
};

const user2 = {
    firstName: "Bernie",
    lastName: "Sanders",
    displayName: "bsanders15",
    email: "bsanders@gmail.com",
    favoriteGames: [],
    ratings: [],
    comments: [],
    profilePic: "null"
};

const user3 = {
    firstName: "Adam",
    lastName: "West",
    displayName: "AWest!!!!",
    email: "batman@gmail.com",
    favoriteGames: [],
    ratings: [],
    comments: [],
    profilePic: "null"
};

const user4 = {
    firstName: "Barack",
    lastName: "Obama",
    displayName: "exPres",
    email: "america@gmail.com",
    favoriteGames: [],
    ratings: [],
    comments: [],
    profilePic: "null"
};

const user5 = {
    firstName: "Jeff",
    lastName: "Bezos",
    displayName: "money010101",
    email: "imreallygreedy@gmail.com",
    favoriteGames: [],
    ratings: [],
    comments: [],
    profilePic: "null"
};

// 10 games
const game1 = {
    ratings: [],
    comments: [],
    endpointId: 54522
};

const game2 = {
    ratings: [],
    comments: [],
    endpointId: 54522
};

const game3 = {
    ratings: [],
    comments: [],
    endpointId: 54522
};

const game4 = {
    ratings: [],
    comments: [],
    endpointId: 54522
};

const game5 = {
    ratings: [],
    comments: [],
    endpointId: 54522
};

const game6 = {
    ratings: [],
    comments: [],
    endpointId: 54522
};

const game7 = {
    ratings: [],
    comments: [],
    endpointId: 54522
};

const game8 = {
    ratings: [],
    comments: [],
    endpointId: 54522
};

const game9 = {
    ratings: [],
    comments: [],
    endpointId: 54522
};

const game10 = {
    ratings: [],
    comments: [],
    endpointId: 54522
};

const main = async () => {
    //initalize the database, or try to anyway
    let db = {};
    try {
        db = await dbConnection();
        await db.dropDatabase();
    } catch (e) {
        console.log(e);
    }

    // first test
    // i need the id's of the game and user, so store those
    let bernie = {};
    let captivus = {};
    try {
        bernie = await userData.addUser(
            user1.firstName,
            user1.lastName,
            user1.displayName,
            user1.email,
            user1.favoriteGames,
            user1.ratings,
            user1.comments,
            user1.profilePic
        );
        captivus = await gameData.addGame(game1.ratings, game1.comments, game1.endpointId);
        await ratingData.addRating(bernie._id, captivus._id, 10, bernie.displayName, "4/19/2021");
        await commentData.addComment(bernie._id, captivus._id, "It really makes you feel like Batman", bernie.displayName, "4/19/2021");
    } catch (e) { console.log(e); }

    try {
        console.log('Done seeding database');
        await db.serverConfig.close();
    } catch (e) {
        console.log(e);
    }
};

main().catch(console.log);