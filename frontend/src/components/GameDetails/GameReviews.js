import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import SectionTitle from '../Home/SectionTitle';
import { Card } from 'react-bootstrap';
import { getUserIdToken } from '../../firebase/FirebaseFunctions';
import { Rating } from '@material-ui/lab';

const styles = makeStyles({
    container: {
        height: 300,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        paddingLeft: 60,
        paddingRight: 60,
    },
    inline: {
        display: 'inline',
    },
    heading: {
        marginLeft: 60,
    },
});

const GameReviews = (props) => {
    const classes = styles();
    const [reviews, setReviews] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const reviewsUrl = `http://localhost:5000/reviews/${props.gameId}`;

    function createReviewsList() {
        if (!reviews) {
            return <h5 class="text-center">No reviews...</h5>;
        } else {
            let cards = reviews.map((r) => {
                return (
                    <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-3 m-3">
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>{r.displayName}</Card.Title>
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
                    </div>
                );
            });
            return (
                <div class="container">
                    <div class="row">{cards}</div>
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
                    <h5 class="text-center">Loading reviews...</h5>
                )}
                {!loading && error && (
                    <h5 class="text-center text-danger">
                        Failed to load reviews...
                    </h5>
                )}
            </div>
            {!loading && !error && createReviewsList()}
        </div>
    );
};

export default GameReviews;
