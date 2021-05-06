import React, { useEffect, useState } from 'react';
import { getUserIdToken } from '../firebase/FirebaseFunctions';
import Button from '@material-ui/core/Button';


const Game = (props) => {
    const [loading, setLoading] = useState(true);
    const [pageData, setPageData] = useState(undefined);
    const [userData, setUserData] = useState(undefined);
    const [favText, setFavText] = useState("Add to Favorites");
    let idToken;
    const email = "donotpassgo@gmail.com";
     

    async function addRemoveFavorites(){
       

        const url = "http://localhost:5000/users/addfavorites";
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { userId: userData.toString(), gameList: [pageData._id]}
        };
        requestOptions.body.idToken = await getUserIdToken();
        requestOptions.idToken = await getUserIdToken();
        requestOptions.body = JSON.stringify(requestOptions.body);
        if (favText == "Add to Favorites"){
            setFavText("Remove From Favorites");
            fetch(url, requestOptions)
            .then(res => res.json())
                .then(
                    (result) => {
                        console.log("Success");
                    },
                    (error) => {
                        console.log("Error: " + error);
                    }
                )
           
        }else{
            setFavText("Add to Favorites");
        }
    }




    async function fetchData() {

        const userUrl = 'http://localhost:5000/users/profile';

        const userRequestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { email: email},
        };
       userRequestOptions.body.idToken = await getUserIdToken();
       userRequestOptions.idToken = await getUserIdToken();
       userRequestOptions.body = JSON.stringify(userRequestOptions.body);
        fetch(userUrl, userRequestOptions)
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
                <br></br>
                <Button variant="contained" color="primary" onClick={async () => {await addRemoveFavorites();}}>{favText}</Button>
            </div>
            
        );
    }
};

export default Game;
