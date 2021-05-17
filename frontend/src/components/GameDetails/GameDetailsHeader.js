import { makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { getUserIdToken } from '../../firebase/FirebaseFunctions';
import { Rating } from '@material-ui/lab';

const styles = makeStyles({
    leftContainer: {
        verticalAlign: 'top',
        display: 'inline-block',
        width: 'calc(20% - 60px)',
        marginLeft: 60,
        minHeight: 200,
        textAlign: 'center',
    },

    rightContainer: {
        position: 'relative',
        width: 'calc(79% - 60px)',
        marginLeft: '1%',
        display: 'inline-block',
        height: 200,
        paddingLeft: 20,
        paddingRight: 20,
    },

    titleDescriptionContainer: {
        width: '90%',
    },

    coverImage: {
        display: 'inline-block',
        verticalAlign: 'top',
        maxWidth: '100%',
        minWidth: '100%',
        minHeight: 300,
        marginBottom: 10,
        objectFit: 'contain',
    },

    relative: {
        position: 'relative',
    },

    publisherLabel: {
        display: 'inline-block',
        padding: 0,
        margin: 0,
        verticalAlign: 'top',
    },

    summary: {
        clear: 'both',
        marginTop: 40,
    },

    ratingBox: {
        display: 'inline-block',
        padding: 0,
        margin: 0,
        marginRight: 10,
        float: 'right',
        textAlign: 'right',
        '& p': {
            margin: 0,
        },
    },

    ratingAverage: {
        position: 'relative',
        bottom: 5,
    },

    ratingStar: {
        marginLeft: 5,
    },

    inlineBlock: {
        display: 'inline-block',
    },

    ageRating: {
        width: '10%',
        position: 'absolute',
        right: 0,
        top: 0,
    },

    ageRatingImage: {
        maxWidth: '100%',
        minWidth: '50%',
    },

    center: {
        textAlign: 'center',
    },
});

const GameDetailsHeader = (props) => {
    const classes = styles();
    const [ageRatingUrl, setAgeRatingUrl] = useState('');
    const [gameDeveloper, setGameDeveloper] = useState('');
    const [favText, setFavText] = useState('');
    const [curFavs, setCurFavs] = useState('');
    const [averageRating, setAverageRating] = useState(undefined);
    const [ratingCount, setRatingCount] = useState(undefined);
    const [ratingLoading, setRatingLoading] = useState(true);
    const [ratingError, setRatingError] = useState(false);

    async function fetchAverageRating() {
        let idToken = await getUserIdToken();
        try {
            const response = await fetch(`http://localhost:5000/reviews/average/${props.data.id}?idToken=${idToken}`);
            if (response.status === 200) {
                const data = await response.json();
                setAverageRating(data.average);
                setRatingCount(data.count);
                setRatingLoading(false);
            } else if (response.status === 404) {
                setAverageRating(undefined);
                setRatingCount(undefined);
                setRatingLoading(false);
            } else {
                setRatingError(true);
            }
        } catch (e) {
            setRatingError(true);
            console.log(e);
        }
    }

    function getRatingInfo() {
        if (ratingError) {
            return (
                <div className={classes.ratingBox}>
                    <p>An error occurred.</p>
                </div>
            );
        } else if (ratingLoading) {
            return (
                <div className={classes.ratingBox}>
                    <p>Loading rating...</p>
                </div>
            );
        } else if (!averageRating && !ratingCount) {
            return (
                <div className={classes.ratingBox}>
                    <p>No ratings yet.</p>
                </div>
            );
        } else {
            return (
                <div className={classes.ratingBox}>
                    <p className={`${classes.inlineBlock} ${classes.ratingAverage} `}>{`${averageRating} / 10`}</p>
                    <div className={`${classes.inlineBlock} ${classes.ratingStar}`}>
                        <Rating name='read-only' value={1} readOnly min={1} max={1} />
                    </div>
                    <p>{`Total Ratings: ${ratingCount}`}</p>
                </div>
            );
        }
    }

    useEffect(() => {
        if (props.data.age_ratings && props.data.age_ratings.length > 0) {
            setAgeRatingUrl(urlForAgeRating(props.data.age_ratings[0].rating));
        }
        if (props.data.involved_companies) {
            let developmentCompanies = props.data.involved_companies.filter((e) => e.developer == true);
            if (developmentCompanies.length > 0) {
                setGameDeveloper(developmentCompanies[0].company.name);
            } else {
                if (props.data.involved_companies.length > 0) {
                    setGameDeveloper(props.data.involved_companies[0].company.name);
                } else {
                    setGameDeveloper('');
                }
            }
        }
        getFavorites();
        fetchAverageRating();
    }, []);

    useEffect(() => {
        if (curFavs.length > 0) {
            for (let i = 0; i < curFavs.length; i++) {
                if (curFavs[i].id == props.data.id) {
                    setFavText('Remove from Favorites');
                    break;
                }
                setFavText('Add to Favorites');
            }
        } else {
            setFavText('Add to Favorites');
        }
    }, [curFavs]);

    async function getFavorites() {
        let idToken = await getUserIdToken();
        const url = 'http://localhost:5000/users/profile/favorites/?idToken=' + idToken;
        fetch(url, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    setCurFavs(result);
                },
                (error) => {
                    console.log(error);
                    setCurFavs(null);
                }
            );
    }

    async function addRemoveFavorites(id) {
        const gameToAdd = props.data.id;
        const url = 'http://localhost:5000/users/modifyfavorites';
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { userId: id.toString(), gameList: [gameToAdd] },
        };
        requestOptions.body.idToken = await getUserIdToken();
        requestOptions.idToken = await getUserIdToken();
        requestOptions.body = JSON.stringify(requestOptions.body);
        if (favText == 'Add to Favorites') {
            setFavText('Remove From Favorites');
            fetch(url + '/add', requestOptions)
                .then((res) => res.json())
                .then(
                    (result) => {},
                    (error) => {
                        console.log('Error: ' + error);
                    }
                );
        } else {
            setFavText('Add to Favorites');
            fetch(url + '/remove', requestOptions)
                .then((res) => res.json())
                .then(
                    (result) => {},
                    (error) => {
                        console.log('Error: ' + error);
                    }
                );
        }
    }

    if (props.reloadAverageRating) {
        // reload after updating / adding a review
        fetchAverageRating();
        props.setReloadAverageRating(false);
    }

    function urlForAgeRating(rating) {
        switch (rating) {
            case 8: {
                return 'https://www.esrb.org/wp-content/uploads/2019/05/E.svg';
            }
            case 9: {
                return 'https://www.esrb.org/wp-content/uploads/2019/05/E10plus.svg';
            }
            case 10: {
                return 'https://www.esrb.org/wp-content/uploads/2019/05/T.svg';
            }
            case 11: {
                return 'https://www.esrb.org/wp-content/uploads/2019/05/M.svg';
            }
            case 12: {
                return 'https://www.esrb.org/wp-content/uploads/2019/05/AO.svg';
            }
            default: {
                return null;
            }
        }
    }

    function gameCategory(num) {
        switch (num) {
            case 0: {
                return 'Main game';
            }
            case 1: {
                return 'Add on';
            }
            case 2: {
                return 'Expansion';
            }
            case 3: {
                return 'Bundle';
            }
            case 4: {
                return 'Stand-alone expansion';
            }
            case 5: {
                return 'Mod';
            }
            case 6: {
                return 'Episode';
            }
            case 7: {
                return 'Season';
            }
            case 8: {
                return 'Remake';
            }
            case 9: {
                return 'Remaster';
            }
            case 10: {
                return 'Expanded game';
            }
            case 11: {
                return 'Port';
            }
            case 12: {
                return 'Fork';
            }
        }
    }

    function platforms(platformArray) {
        const p = [
            { id: 5, name: 'Wii' },
            { id: 9, name: 'PlayStation 3' },
            { id: 12, name: 'Xbox 360' },
            { id: 41, name: 'Wii U' },
            { id: 48, name: 'PlayStation 4' },
            { id: 49, name: 'Xbox One' },
            { id: 130, name: 'Nintendo Switch' },
            { id: 167, name: 'PlayStation 5' },
            { id: 169, name: 'Xbox Series' },
        ];

        let platforms = [];
        p.forEach((element) => {
            if (platformArray.includes(element.id)) {
                platforms.push(element.name);
            }
        });

        const stringToDisplay = platforms.toString().replace(/,/g, ', ');

        return stringToDisplay;
    }

    function genres(genresArray) {
        const g = [
            { id: 4, name: 'Fighting' },
            { id: 5, name: 'Shooter' },
            { id: 7, name: 'Music' },
            { id: 8, name: 'Platform' },
            { id: 9, name: 'Puzzle' },
            { id: 10, name: 'Racing' },
            { id: 11, name: 'Real Time Strategy (RTS)' },
            { id: 12, name: 'Role-playing (RPG)' },
            { id: 13, name: 'Simulator' },
            { id: 14, name: 'Sport' },
        ];

        let genres = [];
        g.forEach((element) => {
            if (genresArray.includes(element.id)) {
                genres.push(element.name);
            }
        });

        const stringToDisplay = genres.toString().replace(/,/g, ', ');

        return stringToDisplay;
    }

    if (props.data.cover && props.data.cover.url) {
        props.data.cover.url = props.data.cover.url.replace('t_thumb', 't_720p');
    } else {
        props.data.cover = { url: '/imgs/imageNotFound.png' };
    }

    return (
        <div>
            <div className={classes.leftContainer}>
                <img className={classes.coverImage} src={props.data.cover.url}></img>
                <div>
                    <button class='btn btn-primary' onClick={async () => addRemoveFavorites(props.userData)}>
                        {favText}
                    </button>
                </div>
            </div>
            <div className={classes.rightContainer}>
                <div className={classes.titleDescriptionContainer}>
                    <h2>{props.data.name}</h2>
                    <div className={classes.relative}>
                        <p className={classes.publisherLabel}>{gameDeveloper}</p>
                        {getRatingInfo()}
                    </div>
                    <p className={classes.summary}>{props.data.summary} </p>
                </div>
                {ageRatingUrl && (
                    <div className={classes.ageRating}>
                        <img className={classes.ageRatingImage} src={ageRatingUrl}></img>
                    </div>
                )}
            </div>
            <div className={classes.center}>
                <p>Game Category: {gameCategory(props.data.category)}</p>
                <p>
                    First Release Date: {new Date(props.data.first_release_date * 1000).toLocaleString() || "A first release date wasn't specified"}
                </p>
                <p>Genres: {genres(props.data.genres) || "Genre(s) not specified"}</p>
                <p>Platforms: {platforms(props.data.platforms) || "Platform(s) not specified"}</p>
            </div>
        </div>
    );
};

export default GameDetailsHeader;
