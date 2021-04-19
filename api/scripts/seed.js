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

const main = async () => {
    //initalize the database, or try too anyway
    let db = {};
    try {
        db = await dbConnection();
        await db.dropDatabase();
    } catch (e) {
        console.log(e);
    }

    let bernie = {};
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
    } catch (e) {
        console.log(e);
    }

    try {
        console.log('Done seeding database');
        await db.serverConfig.close();
    } catch (e) {
        console.log(e);
    }
};

main().catch(console.log);