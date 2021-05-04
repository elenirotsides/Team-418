// TODO: add testing
const dbConnection = require('../config/mongoConnection');
const data = require('../data/index');
const userData = data.users;
const gameData = data.games;
const ratingData = data.ratings;
const commentData = data.comments;

const user1 = {
    firstName: "Bernie",
    lastName: "Sanders",
    displayName: "bsanders15",
    email: "bsanders@gmail.com",
    profilePic: "null"
};

const user2 = {
    firstName: "Monopoly",
    lastName: "Man",
    displayName: "broadway",
    email: "donotpassgo@gmail.com",

    profilePic: "null"
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

    try {
        name1 = await userData.addUser(
            user1.firstName,
            user1.lastName,
            user1.displayName,
            user1.email,
            user1.profilePic
        );

        gaming1 = await gameData.addGame(game1.endpointId);
        rating1 = await ratingData.addRating(name1._id, gaming1._id, 10, "4/19/2021");
        comment1 = await commentData.addComment(name1._id, gaming1._id, "It really makes you feel like Batman", "4/19/2021");
        rating1 = await ratingData.updateRating(rating1._id, 2);
        comment1 = await commentData.updateComment(comment1._id, "This game sucks", "1/1/1999");
        
        await userData.addFavorites(name1._id, [game1.endpointId, game2.endpointId, game3.endpointId, game1.endpointId]);
        
        console.log(await userData.getUserByEmail("bsanders@gmail.com"));
        await userData.removeFavorites(name1._id, [game2.endpointId, game2.endpointId]);

        console.log(await userData.getUserByEmail("bsanders@gmail.com"));
        await userData.addUser(
            "poop",
            "butt",
            "bsanders15",
            "anemail@gmail.com",
            "null"
        );

    } catch (e) { console.log(e) }

};

main().catch(console.log);