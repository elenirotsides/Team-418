import React, { useEffect, useState } from 'react';
import { getUserIdToken } from '../../firebase/FirebaseFunctions';
import GameDetailsHeader from './GameDetailsHeader';
import GameDetailsScreenshots from './GameDetailsScreenshots';
import GameReviews from './GameReviews';
import { makeStyles } from '@material-ui/core';


const styles = makeStyles({
    defaultSpacing: {
        marginTop: 20
    }
});

const Game = (props) => {
    const classes = styles();
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState(undefined);
    const [userData, setUserData] = useState(undefined);
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

    async function fetchUserData(){
        if (!idToken) idToken = await getUserIdToken();

        const userUrl = 'http://localhost:5000/users/profile?idToken=' + idToken;

            fetch(
                userUrl,
                {
                    credentials: 'include',
                }
            ).then((res) => res.json())
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
        return <h3 class="text-center">Loading.....</h3>;
    } else {
        return (
            <div>
                {pageData && (
                    <div>
                        <div className={classes.defaultSpacing}>
                            <GameDetailsHeader userData={userData} setReloadReviews={setReloadReviews} gameId={props.match.params.id} data={pageData} />
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
