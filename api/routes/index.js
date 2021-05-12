const usersRoutes = require('./users');
const reviewsRoutes = require('./reviews');
const gamesRoutes = require('./games');

const constructorMethod = (app) => {
    app.use('/users', usersRoutes);
    app.use('/reviews', reviewsRoutes);
    app.use('/games', gamesRoutes);
    app.all('*', (req, res) => {
        res.status(404).json({ error: 'Route Not Found' });
    });
};

module.exports = constructorMethod;
