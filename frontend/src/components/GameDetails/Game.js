import React, { useEffect, useState } from 'react';
import { getUserIdToken } from '../../firebase/FirebaseFunctions';
import GameDetailsHeader from './GameDetailsHeader';
import GameDetailsScreenshots from './GameDetailsScreenshots';
import GameReviews from './GameReviews';
import { makeStyles } from '@material-ui/core';


const styles = makeStyles({
    defaultSpacing: {
        marginTop: 20
    },
    page: {
        marginBottom:60
    }
});

const Game = (props) => {
    const classes = styles();
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState(undefined);
    const [reloadReviews, setReloadReviews] = useState(false);
    let idToken;

    async function fetchData() {
        if (!idToken) idToken = await getUserIdToken();

        fetch(
            `http://localhost:5000/games/game/${props.match.params.id}?idToken=${idToken}`,
            {
                credentials: 'include',
            }
        ).then((res) => res.json())
            .then(
                (result) => {
                    setPageData(result);
                    setLoading(false);
                },
                (error) => {
                    setPageData(null);
                }
            );

    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <h3 class="text-center">Loading.....</h3>;
    } else {
        return (
            <div className={classes.page}>
                {pageData && (
                    <div>
                        <div className={classes.defaultSpacing}>
                            <GameDetailsHeader setReloadReviews={setReloadReviews} gameId={props.match.params.id} data={pageData} />
                        </div>
                        {pageData.screenshots &&
                            <div className={classes.defaultSpacing}>
                                <GameDetailsScreenshots className={classes.defaultSpacing} data={pageData.screenshots} />
                            </div>
                        }
                        <div className={classes.defaultSpacing}>
                            <GameReviews className={classes.defaultSpacing} gameId={props.match.params.id} reloadReviews={reloadReviews} setReloadReviews={setReloadReviews} />
                        </div>
                        <div className={classes.defaultSpacing}>
                        </div>
                    </div>
                )}
            </div>
        );
    }
};

export default Game;
