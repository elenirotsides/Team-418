import React, { useEffect, useState } from 'react';
import { getUserIdToken } from '../../firebase/FirebaseFunctions';
import GameDetailsHeader from './GameDetailsHeader';
import GameDetailsScreenshots from './GameDetailsScreenshots';
import GameReviews from './GameReviews';
import {Grid, makeStyles } from '@material-ui/core';
import GameMoreDetails from './GameMoreDetails';
import GameDetailsPlatforms from './GameDetailsPlatforms';
import NotFound from '../NotFound';

const styles = makeStyles({
    defaultSpacing: {
        marginTop: 20,
    },
    page: {
        marginBottom: 60,
    },

    details:{
        marginRight:'15%'
    },

    detailCard: {
        border:'solid',
        borderWidth:1,
        borderColor:'lightgray',
        padding:20,
        paddingRight:80,
        paddingLeft:80,
        marginBottom:20,
        marginTop:20,
        maxWidth:'40%'
    }
});

const Game = (props) => {
    const classes = styles();
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState(undefined);
    const [userData, setUserData] = useState(undefined);
    const [reloadReviews, setReloadReviews] = useState(false);
    const [reloadAverageRating, setReloadAverageRating] = useState(false);
    let idToken;

    async function fetchData() {
        if (!idToken) idToken = await getUserIdToken();

        const response = await fetch(
            `http://localhost:5000/games/game/${props.match.params.id}?idToken=${idToken}`,
            {
                credentials: 'include',
            }
        );
        if (response.status === 200) {
            const data = await response.json();
            setPageData(data);
            setLoading(false);
        } else {
            setLoading(false);
            setPageData(null);
        }
    }

    async function fetchUserData() {
        if (!idToken) idToken = await getUserIdToken();

        const userUrl =
            'http://localhost:5000/users/profile?idToken=' + idToken;

        fetch(userUrl, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    setUserData(result._id);
                },
                (error) => {
                    console.log(error);
                    setUserData(error);
                }
            );
    }

    useEffect(() => {
        fetchUserData();

        fetchData();
    }, []);

    if (loading) {
        return <h3 className="text-center">Loading.....</h3>;
    } else {
        return (
            <div className={classes.page}>
                {pageData && (
                    <div>
                        <div className={classes.defaultSpacing}>
                            <GameDetailsHeader
                                userData={userData}
                                reloadAverageRating={reloadAverageRating}
                                setReloadAverageRating={setReloadAverageRating}
                                gameId={props.match.params.id}
                                data={pageData}
                            />
                        </div>
                        <div className={classes.defaultSpacing}>
                            <Grid container justify='center' alignItems='center'>
                                <Grid key='details' item s={12} m={6} className={`${classes.details} ${classes.detailCard}`}>
                                    <div>
                                        <GameMoreDetails data={pageData} />
                                    </div>
                                </Grid>
                                <Grid key='platforms' item s={12} m={6} className={classes.detailCard}>
                                    <div className={classes.platforms}>
                                        <GameDetailsPlatforms data={pageData} />
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        {pageData.screenshots && (
                            <div className={classes.defaultSpacing}>
                                <GameDetailsScreenshots
                                    className={classes.defaultSpacing}
                                    data={pageData.screenshots}
                                />
                            </div>
                        )}
                        <div className={classes.defaultSpacing}>
                            <GameReviews
                                className={classes.defaultSpacing}
                                gameId={props.match.params.id}
                                reloadReviews={reloadReviews}
                                setReloadReviews={setReloadReviews}
                                setReloadAverageRating={setReloadAverageRating}
                            />
                        </div>
                        <div className={classes.defaultSpacing}></div>
                    </div>
                )}

                {!pageData && <NotFound />}
            </div>
        );
    }
};

export default Game;
