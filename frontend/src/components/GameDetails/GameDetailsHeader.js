import { makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import GameSizableCard from '../Home/GameSizableCard';
import { getUserIdToken } from '../../firebase/FirebaseFunctions';
import GameReviewModal from './GameReviewModal';

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
        width: '90%'
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
        minWidth: 'calc(100% - 150px)',
        padding: 0,
        margin: 0
    },

    ratingBox: {
        display: 'inline-block',
        padding: 0,
        margin: 0,
        height: 30,
        width: 150,
        backgroundColor: 'yellow'
    },

    ageRating: {
        width: '10%',
        position: 'absolute',
        right: 0,
        top: 0
    },

    ageRatingImage: {
        maxWidth: '100%',
        minWidth: '50%'
    }

});

const GameDetailsHeader = (props) => {
    const classes = styles();
    const [coverURL, setCoverURL] = useState('');
    const [ageRatingUrl, setAgeRatingUrl] = useState('');
    const [gameDeveloper, setGameDeveloper] = useState('');

    useEffect(() => {
        if (props.data.age_ratings && props.data.age_ratings.length > 0) {
            setAgeRatingUrl(urlForAgeRating(props.data.age_ratings[0].rating));
        }
        if (props.data.involved_companies) {
            setGameDeveloper(props.data.involved_companies.filter((e) => e.developer == true)[0].company.name);
        }
    }, []);

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
        props.data.cover = {url:'/imgs/imageNotFound.png'};
    }

    return (
        <div>
            <div className={classes.leftContainer}>
                <img className={classes.coverImage} src={props.data.cover.url}></img>
                <div>
                    <button>Add to favorites</button>
                </div>
            </div>
            <div className={classes.rightContainer}>
                <div className={classes.titleDescriptionContainer}>
                    <h2>{props.data.name}</h2>
                    <div className={classes.relative}>
                        <p className={classes.publisherLabel}>{gameDeveloper}</p>
                        <div className={classes.ratingBox}>RatingBox</div>
                        <GameReviewModal gameId={props.gameId} setReloadReviews={props.setReloadReviews}/>
                    </div>
                    <p>{props.data.summary} </p>

                </div>
                {ageRatingUrl &&
                    <div className={classes.ageRating}>
                        <img className={classes.ageRatingImage} src={ageRatingUrl}></img>
                    </div>
                }
            </div>
        </div>
    );
}

export default GameDetailsHeader;