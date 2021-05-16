const dataKeys = {
    games: 'games/',
    gamesPopular: 'games/popular',
    gamesNew: 'games/new',
    gamesId: (id) => {
        return `games/${id}`;
    },
    featuredGame: '/featured',
    gamesSearch: (searchTerm) => {
        return `gamesSearch#${searchTerm}`;
    },
    gamesSearchInfo: 'games/search/info',
    gamesGenres: '/games/genres'
};

module.exports = dataKeys;
