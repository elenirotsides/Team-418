const dataKeys = {
    games: 'games/',
    gamesPopular: (type, offset)  => {
        return `games/popular/${type}/${offset}`;
    },
    gamesNew: (type, offset)  => {
        return `games/new/${type}/${offset}`;
    },
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
