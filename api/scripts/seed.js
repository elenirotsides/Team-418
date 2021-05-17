// TODO: add seed
const dbConnection = require('../config/mongoConnection');
const data = require('../data/index');
const userData = data.users;
const gameData = data.games;
const reviewData = data.reviews;

const user1 = {
    firstName: 'Jordan',
    lastName: 'Handwerger',
    displayName: 'jHand',
    email: 'jhandwer@stevens.edu',
};

const user2 = {
    firstName: 'Patrick',
    lastName: 'Sommer',
    displayName: 'Mason',
    email: 'psommer@stevens.edu',
};

const user3 = {
    firstName: 'Eleni',
    lastName: 'Rotsides',
    displayName: 'eRot',
    email: 'erotside@stevens.edu',
};

const user4 = {
    firstName: 'Zachary',
    lastName: 'Zwerling',
    displayName: 'tooManyZs',
    email: 'zzwerlin@stevens.edu',
};

const user5 = {
    firstName: 'Ishaan',
    lastName: 'Patel',
    displayName: 'arandomdude',
    email: 'ipatel9@stevens.edu',
};

const user6 = {
    firstName: 'Bernie',
    lastName: 'Sanders',
    displayName: 'bsanders15',
    email: 'bsanders@gmail.com',
};

const user7 = {
    firstName: 'Monopoly',
    lastName: 'Man',
    displayName: 'broadway',
    email: 'donotpassgo@gmail.com',
};

const user8 = {
    firstName: 'Adam',
    lastName: 'West',
    displayName: 'AWest!!!!',
    email: 'batman@gmail.com',
};

const user9 = {
    firstName: 'Barack',
    lastName: 'Obama',
    displayName: 'exPres',
    email: 'america@gmail.com',
};

const user10 = {
    firstName: 'Jeff',
    lastName: 'Bezos',
    displayName: 'money010101',
    email: 'imreallygreedy@gmail.com',
};

// 10 games
const game1 = {
    endpointId: 103298,
};

const game2 = {
    endpointId: 109462,
};

const game3 = {
    endpointId: 113112,
};

const game4 = {
    endpointId: 26192,
};

const game5 = {
    endpointId: 11169,
};

const game6 = {
    endpointId: 90101,
};

const game7 = {
    endpointId: 103329,
};

const game8 = {
    endpointId: 361,
};

const game9 = {
    endpointId: 103281,
};

const game10 = {
    endpointId: 19560,
};

const featured_game = {
    endpointId: 146505,
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

    // the part where i add all the games and names
    let gaming2;
    let gaming3;
    let gaming4;
    let gaming5;
    let gaming6;
    let gaming7;
    let gaming8;
    let gaming9;
    let gaming10;
    let featured;
    let name2;
    let name3;
    let name4;
    let name5;
    let name6;
    let name7;
    let name8;
    let name9;
    let name10;
    try {
        console.log('Adding users...');
        name1 = await userData.addUser(
            user1.firstName,
            user1.lastName,
            user1.displayName,
            user1.email
        );

        name2 = await userData.addUser(
            user2.firstName,
            user2.lastName,
            user2.displayName,
            user2.email
        );

        name3 = await userData.addUser(
            user3.firstName,
            user3.lastName,
            user3.displayName,
            user3.email
        );

        name4 = await userData.addUser(
            user4.firstName,
            user4.lastName,
            user4.displayName,
            user4.email
        );

        name5 = await userData.addUser(
            user5.firstName,
            user5.lastName,
            user5.displayName,
            user5.email
        );

        name6 = await userData.addUser(
            user6.firstName,
            user6.lastName,
            user6.displayName,
            user6.email
        );

        name7 = await userData.addUser(
            user7.firstName,
            user7.lastName,
            user7.displayName,
            user7.email
        );

        name8 = await userData.addUser(
            user8.firstName,
            user8.lastName,
            user8.displayName,
            user8.email
        );

        name9 = await userData.addUser(
            user9.firstName,
            user9.lastName,
            user9.displayName,
            user9.email
        );

        name10 = await userData.addUser(
            user10.firstName,
            user10.lastName,
            user10.displayName,
            user10.email
        );

        console.log('Adding games...');
        gaming2 = await gameData.addGame(game2.endpointId);
        gaming3 = await gameData.addGame(game3.endpointId);
        gaming4 = await gameData.addGame(game4.endpointId);
        gaming5 = await gameData.addGame(game5.endpointId);
        gaming6 = await gameData.addGame(game6.endpointId);
        gaming7 = await gameData.addGame(game7.endpointId);
        gaming8 = await gameData.addGame(game8.endpointId);
        gaming9 = await gameData.addGame(game9.endpointId);
        gaming10 = await gameData.addGame(game10.endpointId);
        featured = await gameData.addGame(featured_game.endpointId);
    } catch (e) {
        console.log(e);
    }

    // Adding statuses to each user

    try {
        console.log(await userData.editStatus(name1.email, "Having a good time"))
    } catch (e) {
        console.log(e)
    }

    try {
        console.log(await userData.editStatus(name2.email, "Playing Fortnite"))
    } catch (e) {
        console.log(e)
    }

    try {
        console.log(await userData.editStatus(name3.email, "Chillin like a villian"))
    } catch (e) {
        console.log(e)
    }

    try {
        console.log(await userData.editStatus(name4.email, "Need a partner for some epic APEX duos"))
    } catch (e) {
        console.log(e)
    }

    try {
        console.log(await userData.editStatus(name5.email, "Meh"))
    } catch (e) {
        console.log(e)
    }

    try {
        console.log(await userData.editStatus(name6.email, "I'm tired"))
    } catch (e) {
        console.log(e)
    }

    try {
        console.log(await userData.editStatus(name7.email, "Working on Web dev hw don't bother me"))
    } catch (e) {
        console.log(e)
    }

    try {
        console.log(await userData.editStatus(name8.email, "Busy"))
    } catch (e) {
        console.log(e)
    }

    try {
        console.log(await userData.editStatus(name9.email, "Listening to music"))
    } catch (e) {
        console.log(e)
    }

    try {
        console.log(await userData.editStatus(name10.email, "Living life like Larry"))
    } catch (e) {
        console.log(e)
    }

    // the part where i now add in a crap ton of reviews
    try {
        console.log('Adding reviews...');
        await reviewData.addReview(
            name1.email,
            featured.endpointId,
            1,
            '01/01/2000',
            'I died so the game sucks'
        );
        await reviewData.addReview(
            name2.email,
            featured.endpointId,
            2,
            '12/10/2012',
            "I don't even have this game"
        );
        await reviewData.addReview(
            name3.email,
            featured.endpointId,
            3,
            '02/20/2001',
            'This game is like the dark souls of dark souls'
        );
        await reviewData.addReview(
            name4.email,
            featured.endpointId,
            4,
            '03/05/2009',
            'Definitely not worth the full price for this game'
        );
        await reviewData.addReview(
            name5.email,
            featured.endpointId,
            5,
            '04/12/1999',
            'Lots of wasted potential here'
        );
        await reviewData.addReview(
            name6.email,
            featured.endpointId,
            6,
            '05/04/2005',
            'If you want some dumb fun and nothing else this game works'
        );
        await reviewData.addReview(
            name7.email,
            featured.endpointId,
            7,
            '06/24/2002',
            "It's a nice game, doesn't blow away my expectations but it's good"
        );
        await reviewData.addReview(
            name8.email,
            featured.endpointId,
            8,
            '07/18/2003',
            'Had a lot of fun with this game, definitely would reccommend'
        );
        await reviewData.addReview(
            name9.email,
            featured.endpointId,
            9,
            '09/25/2021',
            'Oh man this game is amazing'
        );
        await reviewData.addReview(
            name10.email,
            featured.endpointId,
            10,
            '10/02/1984',
            'Is a MASTAPIECE'
        );
    } catch (e) {
        console.log(e);
    }

    // the part where i give each user some favorite games
    try {
        console.log('Adding favorites...');
        await userData.addFavorites(name1._id, [
            game1.endpointId,
            game2.endpointId,
            featured_game.endpointId,
        ]);
        await userData.addFavorites(name2._id, [
            game3.endpointId,
            game4.endpointId,
        ]);
        await userData.addFavorites(name3._id, [
            game5.endpointId,
            game6.endpointId,
            featured_game.endpointId,
        ]);
        await userData.addFavorites(name4._id, [
            game7.endpointId,
            game8.endpointId,
        ]);
        await userData.addFavorites(name5._id, [
            game9.endpointId,
            game10.endpointId,
            featured_game.endpointId,
        ]);
        await userData.addFavorites(name6._id, [
            game1.endpointId,
            game2.endpointId,
        ]);
        await userData.addFavorites(name7._id, [
            game3.endpointId,
            game4.endpointId,
            featured_game.endpointId,
        ]);
        await userData.addFavorites(name8._id, [
            game5.endpointId,
            game6.endpointId,
        ]);
        await userData.addFavorites(name9._id, [
            game7.endpointId,
            game8.endpointId,
        ]);
        await userData.addFavorites(name10._id, [
            game9.endpointId,
            game10.endpointId,
            featured_game.endpointId,
        ]);
    } catch (e) {
        console.log(e);
    }

    // close the database and call it a day
    try {
        console.log('Done seeding database');
        await db.serverConfig.close();
    } catch (e) {
        console.log(e);
    }
};

main().catch(console.log);
