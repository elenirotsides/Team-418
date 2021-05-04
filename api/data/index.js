const usersData = require('./users');
const commentsData = require('./comments');
const ratingsData = require('./ratings');
const gamesData = require('./games');
const validation = require('./validation');

module.exports = {
    users: usersData,
    comments: commentsData,
    ratings: ratingsData,
    games: gamesData,
    validation: validation
};
