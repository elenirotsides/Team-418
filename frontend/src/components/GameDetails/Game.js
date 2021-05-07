import React, { useEffect, useState } from 'react';
import { getUserIdToken } from '../../firebase/FirebaseFunctions';
import GameDetailsHeader from './GameDetailsHeader';
import GameDetailsScreenshots from './GameDetailsScreenshots';
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
        return <p>Loading.....</p>;
    } else {
        return (
            <div>
                {pageData && (
                    <div>
                        <div className={classes.defaultSpacing}>
                            <GameDetailsHeader data={pageData} />
                        </div>
                        <div className={classes.defaultSpacing}>
                            <GameDetailsScreenshots className={classes.defaultSpacing} data={pageData.screenshots} />
                        </div>
                        <div className={classes.defaultSpacing}></div>
                    </div>
                )}
            </div>
        );
    }
};

export default Game;
