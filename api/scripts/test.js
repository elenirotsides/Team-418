// TODO: add testing
const dbConnection = require('../config/mongoConnection');
const data = require('../data/index');
const userData = data.users;
const gameData = data.games;
const reviewData = data.reviews;

const user1 = {
    firstName: "Bernie",
    lastName: "Sanders",
    displayName: "bsanders15",
    email: "bsanders@gmail.com",
};

const user2 = {
    firstName: "Monopoly",
    lastName: "Man",
    displayName: "broadway",
    email: "donotpassgo@gmail.com",
};

const game1 = {
    endpointId: 54522
};

const game2 = {
    endpointId: 40104
};

const game3 = {
    endpointId: 20950
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

    let name1;
    let gaming1;
    let rating1;
    let comment1;
    let name2;

    try {
        name1 = await userData.addUser(
            user1.firstName,
            user1.lastName,
            user1.displayName,
            user1.email,
        );
        gaming1 = await gameData.addGame(game1.endpointId);
        review1 = await reviewData.addReview(name1._id, gaming1._id, 10, "4/19/2201");

        review1 = await reviewData.updateComment(review1._id, "Good game");

        review1 = await reviewData.updateRating(review1._id, 1, "3/2/1990");
        review1 = await reviewData.updateReview(review1._id, 5, "meh", "1/1/2005");
        
        await userData.addFavorites(name1._id, [game1.endpointId, game2.endpointId, game3.endpointId, game1.endpointId]);
        await userData.removeFavorites(name1._id, [game2.endpointId, game2.endpointId]);

        let name2 = await userData.addUser(
            "poop",
            "butt",
            "basd",
            "bsandsfsdfdsers@gmail.com",
        );

    } catch (e) { console.log(e) }
    console.log("Done with testing");

};

main().catch(console.log);