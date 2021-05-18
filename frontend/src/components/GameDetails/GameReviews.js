import React, { useEffect, useState } from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import SectionTitle from '../Home/SectionTitle';
import { Card } from 'react-bootstrap';
import { getUserIdToken } from '../../firebase/FirebaseFunctions';
import { Rating } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import GameReviewModal from './GameReviewModal';


const styles = makeStyles({
    container: {
        overflowX: 'auto',
        minWidth: '100%',
    },
    inline: {
        display: 'inline',
    },
    heading: {
        marginLeft: 60,
    },
    noReviews: {
        marginBottom: 50
    },

    reviewButton: {
        marginBottom: 20,
        textAlign: 'center'
    },

    text: {
        color: '#0061c9',
    },
});

const GameReviews = (props) => {
    const classes = styles();
    const [reviews, setReviews] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    function createReviewsList() {
        if (!reviews) {
            return (
                <div className={classes.noReviews}>
                    <div className={classes.reviewButton}>
                        <GameReviewModal gameId={props.gameId} setReloadReviews={props.setReloadReviews} setReloadAverageRating={props.setReloadAverageRating} />
                    </div>
                    <h2></h2>
                    <h3></h3>
                    <h4></h4>
                    <h5 className="text-center">No reviews</h5>
                </div>);
        } else {
            let cards = reviews.map((r) => {
                return (
                    <Grid key={r.userId} item className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 m-4">
                        <Card style={{ width: '100%' }}>
                            <Card.Body>
                                <Link to={{
                                    pathname: `/users/${r.userId}`,
                                    userId: r.userId,
                                    sameUser: false
                                }
                                }>
                                    <Card.Title className={classes.text}>{r.username}</Card.Title>
                                </Link>
                                <Rating
                                    name="read-only"
                                    value={r.rating}
                                    readOnly
                                    min={1}
                                    max={10}
                                />
                                <Card.Text>{r.comment}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Grid>
                );
            });
            return (
                <div>
                    <div className={classes.reviewButton}>
                        <GameReviewModal gameId={props.gameId} setReloadReviews={props.setReloadReviews} setReloadAverageRating={props.setReloadAverageRating} />
                    </div>
                    <Grid container justify='center' alignItems='center' className={`noScrollbar ${classes.container}`}>
                        {cards}
                    </Grid>
                </div>

            );
        }
    }

    async function fetchReviews() {
        let idToken = await getUserIdToken();
        try {
            const response = await fetch(
                `http://localhost:5000/reviews/${props.gameId}?idToken=${idToken}`,
                {
                    method: 'GET',
                }
            );
            if (response.status === 200) {
                const data = await response.json();
                if (data.length === 0) {
                    setReviews(false);
                } else {
                    setReviews(data);
                }
                setLoading(false);
            } else if (response.status !== 404) {
                setError(true);
            }
        } catch (e) {
            console.log('Failed to get reviews for game', e);
            setError(true);
        }
    }

    useEffect(() => {
        fetchReviews();
    }, [props.reloadReviews, props.setReloadReviews]);

    if (props.reloadReviews) {
        // reload after updating / adding a review
        fetchReviews();
        props.setReloadReviews(false);
    }
    return (
        <div>
            <div className={classes.heading}>
                <SectionTitle title="Reviews" />
            </div>
            <div className={classes.heading}>
                {loading && !error && (
                    <h5 className="text-center">Loading reviews...</h5>
                )}
                {!loading && error && (
                    <h5 className="text-center text-danger">
                        Failed to load reviews...
                    </h5>
                )}
            </div>
            {!loading && !error && createReviewsList()}
        </div>
    );
};

export default GameReviews;
