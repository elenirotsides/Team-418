import React, { useEffect, useState } from 'react';

const Game = (props) => {

    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState(undefined);

    useEffect(() => {
        // get popular games
        fetch(`http://localhost:5000/games/game/${props.match.params.id}`, {
            credentials: 'include'
        }).then(res => res.json())
            .then(
                (result) => {
                    setPageData(result);
                },
                (error) => {
                    setPageData(null);
                }
            )
            setLoading(false);
    }, []);

    if (loading) {
        return (
            <p>Loading.....</p>
        )
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
