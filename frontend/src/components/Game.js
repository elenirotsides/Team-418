import React, { useEffect, useState } from 'react';
import { getUserIdToken } from '../firebase/FirebaseFunctions';
import Button from '@material-ui/core/Button';


const Game = (props) => {
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState(undefined);
    const [favText, setFavText] = useState(undefined);
    let idToken;
     

    async function addRemoveFavorites(){
        if (favText == "Add to Favorites"){
            setFavText("Remove From Favorites");
        }else{
            setFavText("Add to Favorites");
        }
    }




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
        setFavText("Add to Favorites");
    }, []);

    if (loading) {
        return <p>Loading.....</p>;
    } else {
        return (
            <div>
                <p>Game Details!!</p>
                {pageData && `${pageData[0].name}`}
                <br></br>
                <Button variant="contained" color="primary" onClick={async () => {await addRemoveFavorites();}}>{favText}</Button>
            </div>
            
        );
    }
};

export default Game;
