const usersRoutes = require('./users');
const commentsRoutes = require('./comments');
const ratingsRoutes = require('./ratings');
const gamesRoutes = require('./games');

const constructorMethod = (app) => {
    app.use('/users', usersRoutes);
    app.use('/comments', commentsRoutes);
    app.use('/ratings', ratingsRoutes);
    app.use('/games', gamesRoutes);
    app.all('*', (req, res) => {
        res.status(404).json({ error: 'Route Not Found' });
    });
};

module.exports = constructorMethod;
