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
    gamesSearch: (searchTerm) => {
        return `gamesSearch#${searchTerm}`
    }
};
module.exports = dataKeys;
