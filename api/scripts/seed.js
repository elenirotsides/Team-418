// TODO: add seed
const dbConnection =  require('../config/mongoConnection');
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

const user3 = {
    firstName: "Adam",
    lastName: "West",
    displayName: "AWest!!!!",
    email: "batman@gmail.com",
    profilePic: "null"
};

const user4 = {
    firstName: "Barack",
    lastName: "Obama",
    displayName: "exPres",
    email: "america@gmail.com",
    profilePic: "null"
};

const user5 = {
    firstName: "Jeff",
    lastName: "Bezos",
    displayName: "money010101",
    email: "imreallygreedy@gmail.com",
    profilePic: "null"
};

// 10 games
const game1 = {
    endpointId: 54522
};

const game2 = {
    endpointId: 40104
};

const game3 = {
    endpointId: 20950
};

const game4 = {
    endpointId: 68841
};

const game5 = {
    endpointId: 33284
};

const game6 = {
    endpointId: 104748
};

const game7 = {
    endpointId: 85450
};

const game8 = {
    endpointId: 53297
};

const game9 = {
    endpointId: 89616
};

const game10 = {
    endpointId: 90512
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

    // i need the id's of the game and user, so store those
    let bernie;
    let captivus;
    try {
        bernie = await userData.addUser(
            user1.firstName,
            user1.lastName,
            user1.displayName,
            user1.email,
            user1.profilePic
        );
        captivus = await gameData.addGame(game1.endpointId);
        await ratingData.addRating(bernie._id, captivus._id, 10, "4/19/2021");
        await commentData.addComment(bernie._id, captivus._id, "It really makes you feel like Batman", "4/19/2021");
    } catch (e) { console.log(e); }

    // the part where i add all the other games and names because inital tests passed
    let gaming2; let gaming3; let gaming4; let gaming5; let gaming6; let gaming7; let gaming8; let gaming9; let gaming10;
    let name2; let name3; let name4; let name5;
    try {
        name2 = await userData.addUser(
            user2.firstName,
            user2.lastName,
            user2.displayName,
            user2.email,
            user2.profilePic
        );

        name3 = await userData.addUser(
            user3.firstName,
            user3.lastName,
            user3.displayName,
            user3.email,
            user3.profilePic
        );

        name4 = await userData.addUser(
            user4.firstName,
            user4.lastName,
            user4.displayName,
            user4.email,
            user4.profilePic
        );

        name5 = await userData.addUser(
            user5.firstName,
            user5.lastName,
            user5.displayName,
            user5.email,
            user5.profilePic
        );

        gaming2 = await gameData.addGame(game2.endpointId);
        gaming3 = await gameData.addGame( game3.endpointId);
        gaming4 = await gameData.addGame(game4.endpointId);
        gaming5 = await gameData.addGame(game5.endpointId);
        gaming6 = await gameData.addGame(game6.endpointId);
        gaming7 = await gameData.addGame(game7.endpointId);
        gaming8 = await gameData.addGame(game8.endpointId);
        gaming9 = await gameData.addGame(game9.endpointId);
        gaming10 = await gameData.addGame(game10.endpointId);
    } catch (e) { console.log(e); }

    // the part where i now add in a crap ton of ratings and comments
    try {
        //await ratingData.addRating(bernie._id, captivus._id, 10, bernie.displayName, "4/19/2021");
        //await commentData.addComment(bernie._id, captivus._id, "It really makes you feel like Batman", bernie.displayName, "4/19/2021");
        await ratingData.addRating(name2._id, gaming2._id, 2, "01/01/2000");
        await ratingData.addRating(name2._id, gaming3._id, 7, "12/10/2012");
        await ratingData.addRating(name3._id, gaming4._id, 5, "02/20/2001");
        await ratingData.addRating(name3._id, gaming5._id, 1, "03/05/2009");
        await ratingData.addRating(name4._id, gaming6._id, 3, "04/12/1999");
        await ratingData.addRating(name4._id, gaming7._id, 8, "05/04/2005");
        await ratingData.addRating(name5._id, gaming8._id, 6, "06/24/2002");
        await ratingData.addRating(name5._id, gaming9._id, 4, "07/18/2003");
        await ratingData.addRating(name2._id, gaming10._id, 10, "08/28/2020");
        await ratingData.addRating(name3._id, gaming2._id, 1, "09/25/2021");
        await ratingData.addRating(name4._id, gaming3._id, 8, "10/02/1984");
        await ratingData.addRating(name5._id, gaming4._id, 3, "11/10/2008");

        await commentData.addComment(name2._id, gaming2._id, "This comment is pointless", "01/01/2000");
        await commentData.addComment(name2._id, gaming3._id, "Who am i", "01/01/2000");
        await commentData.addComment(name3._id, gaming4._id, "This game is too hard", "01/01/2000");
        await commentData.addComment(name3._id, gaming5._id, "It's like the dark souls of crap", "01/01/2000");
        await commentData.addComment(name4._id, gaming6._id, "I don't even have this game", "01/01/2000");
        await commentData.addComment(name4._id, gaming7._id, "Fun but not worth 70 bucks", "01/01/2000");
        await commentData.addComment(name5._id, gaming8._id, "MTX ruins this game", "01/01/2000");
        await commentData.addComment(name5._id, gaming9._id, "It has a little something for everyone", "01/01/2000");
        await commentData.addComment(name2._id, gaming10._id, "I hate this game", "01/01/2000");
        await commentData.addComment(name3._id, gaming2._id, "This game is a terrible slog of boredom", "01/01/2000");
        await commentData.addComment(name4._id, gaming3._id, "Best game ever, super fun", "01/01/2000");
        await commentData.addComment(name5._id, gaming4._id, "Meh, you should wait till this goes on sale", "01/01/2000");
        await commentData.addComment(name2._id, gaming5._id, "This game creeps me out", "01/01/2000");
    } catch (e) { console.log(e); }

    // close the database and call it a day
    try {
        console.log('Done seeding database');
        await db.serverConfig.close();
    } catch (e) {
        console.log(e);
    }
};

main().catch(console.log);