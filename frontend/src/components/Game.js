import React, { useEffect, useState } from 'react';
import { getUserIdToken } from '../firebase/FirebaseFunctions';

const Game = (props) => {
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
        )
            .then((res) => res.json())
            .then(
                (result) => {
                    setPageData(result);
                },
                (error) => {
                    setPageData(null);
                }
            );
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <p>Loading.....</p>;
    } else {
        return (
            <div>
                <p>Game Details!!</p>
                {pageData && `${pageData[0].name}`}
            </div>
        );
    }
};

export default Game;
