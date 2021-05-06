const dataKeys = {
    games: 'games/',
    gamesPopular: 'games/popular',
    gamesNew: 'games/new',
    gamesId: (id) => {
        return `games/${id}`;
    },
    featuredGame: '/featured',
    coverId: (id) => {
        return `games/${id}`;
    },
};
module.exports = dataKeys;
