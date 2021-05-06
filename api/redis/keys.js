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
        return `gamesSearch#${searchTerm}`;
    },
    gamesGenres: 'games/genres',
    gamesSearchInfo: 'games/search/info',
};

module.exports = dataKeys;
