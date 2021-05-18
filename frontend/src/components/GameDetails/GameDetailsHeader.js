import { makeStyles, useScrollTrigger } from '@material-ui/core';
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

    buttons: {
        color: 'white',
        backgroundColor: '#0061c9',
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
                setAverageRating(data.average.toFixed(2));
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
                    (result) => { },
                    (error) => {
                        console.log('Error: ' + error);
                    }
                );
        } else {
            setFavText('Add to Favorites');
            fetch(url + '/remove', requestOptions)
                .then((res) => res.json())
                .then(
                    (result) => { },
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

    if (props.data.cover && props.data.cover.url) {
        props.data.cover.url = props.data.cover.url.replace('t_thumb', 't_720p');
    } else {
        props.data.cover = { url: '/imgs/imageNotFound.png' };
    }

    return (
        <div>
            <div className={classes.leftContainer}>
                <img
                    className={classes.coverImage}
                    src={props.data.cover.url}
                    alt= "Cover Image"
                ></img>
                <div>
                    <button
                        class={`btn ${classes.buttons}`}
                        onClick={async () => addRemoveFavorites(props.userData)}
                    >
                        {favText}
                    </button>
                </div>
            </div>
            <div className={classes.rightContainer}>
                <div className={classes.titleDescriptionContainer}>
                    <h1></h1>
                    <h2>{props.data.name}</h2>
                    <div className={classes.relative}>
                        <p className={classes.publisherLabel}>{gameDeveloper}</p>
                        {getRatingInfo()}
                    </div>
                    <p className={classes.summary}>{props.data.summary} </p>
                </div>
                {ageRatingUrl && (
                    <div className={classes.ageRating}>
                        <img
                            alt = "Age Rating"
                            className={classes.ageRatingImage}
                            src={ageRatingUrl}
                        ></img>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameDetailsHeader;
