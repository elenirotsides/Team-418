import React, { useEffect, useState } from 'react';
import SignOutButton from './LogOut';
import { getUserIdToken } from '../firebase/FirebaseFunctions';

const Profile = (props) => {

    const [pageData, setPageData] = useState(undefined);
    const [ratingData, setRatingData] = useState(undefined);
    const [ratingIdData, setRatingIdData] = useState(undefined);
    const loaded = false;
    const email = 'donotpassgo@gmail.com';
    const infoUrl = 'http://localhost:5000/users/profile';
    const ratingsUrl = 'http://localhost:5000/ratings/retrieve';
    const infoRequestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email: email },
    };

    useEffect(() => {
        async function fetchMyApi() {
            infoRequestOptions.body.idToken = await getUserIdToken();
            infoRequestOptions.idToken = await getUserIdToken();
            infoRequestOptions.body = JSON.stringify(infoRequestOptions.body);
            fetch(infoUrl, infoRequestOptions)
                .then((res) => res.json())
                .then(
                    (result) => {
                        setPageData(result);
                    },
                    (error) => {
                        console.log(error);
                        setPageData(error);
                    }
                );
        }
        fetchMyApi();
    }, []);
   
    useEffect(() => {
        if (ratingIdData){
            const ratingRequestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: ratingIdData.toString()})
            };


            fetch(ratingsUrl, ratingRequestOptions)
            .then(res => res.json())
                .then(
                    (result) => {
                        setRatingData(result);
                    },
                    (error) => {
                        setRatingData(error);
                    }
                )
        }
       
    }, [ratingIdData]);

   

   

    //TO-DO: add stuff to profile later
    return (
        <div className="text-center">
            <h2>Profile Page</h2>
            <h3>Name: </h3>
            <p>{pageData && pageData.firstName} {pageData && pageData.lastName}</p>
            <h3>Email: </h3>
            <p>{pageData && pageData.email}</p>
            <h3>Username: </h3>
            <p>{pageData && pageData.displayName}</p>
            
            <SignOutButton />
        </div>
    );
};

export default Profile;
