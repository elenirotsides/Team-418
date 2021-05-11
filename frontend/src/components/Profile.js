import React, { useEffect, useState } from 'react';
import SignOutButton from './LogOut';
import { getUserIdToken } from '../firebase/FirebaseFunctions';
import ProfilePictureModal from './ProfilePictureModal';

const Profile = (props) => {
    const [pageData, setPageData] = useState(undefined);
    const [error, setError] = useState(false);
    const [ratingData, setRatingData] = useState(undefined);
    const [ratingIdData, setRatingIdData] = useState(undefined);
    const [idToken, setIdToken] = useState(false);
    const infoUrl = 'http://localhost:5000/users/profile';
    const ratingsUrl = 'http://localhost:5000/ratings/retrieve';

    async function fetchMyApi() {
        let token = idToken;
        if (!idToken) {
            token = await getUserIdToken();
            await setIdToken(token);
        }
        try {
            const response = await fetch(`${infoUrl}?idToken=${token}`, {
                method: 'GET',
            });
            const data = await response.json();
            setPageData(data);
        } catch (e) {
            console.log(e);
            setError(true);
        }
    }

    useEffect(() => {
        fetchMyApi();
    }, []);

    useEffect(() => {
        if (ratingIdData) {
            const ratingRequestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: ratingIdData.toString() }),
            };

            fetch(ratingsUrl, ratingRequestOptions)
                .then((res) => res.json())
                .then(
                    (result) => {
                        setRatingData(result);
                    },
                    (error) => {
                        setRatingData(error);
                    }
                );
        }
    }, [ratingIdData]);

    //TO-DO: add stuff to profile later
    return (
        <div className="text-center">
            <h2>Profile Page</h2>
            {!idToken && <img src="/imgs/profile.png" alt="profile" />}
            {idToken && (
                <img
                    crossOrigin="anonymous"
                    class="my-3 bg-dark"
                    src={`http://localhost:5000/users/picture?idToken=${idToken}`}
                    alt="profile"
                />
            )}
            <br />
            {idToken && <ProfilePictureModal idToken={idToken} />}
            <h3>Name: </h3>
            <p>
                {pageData && pageData.firstName} {pageData && pageData.lastName}
            </p>
            <h3>Email: </h3>
            <p>{pageData && pageData.email}</p>
            <h3>Username: </h3>
            <p>{pageData && pageData.displayName}</p>
            <SignOutButton />
        </div>
    );
};

export default Profile;
