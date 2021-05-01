import React, { useEffect, useState } from 'react';
import SignOutButton from './LogOut';
import { getUserIdToken } from '../firebase/FirebaseFunctions';

const Profile = (props) => {
    //call backend route and retrieve response
    const [pageData, setPageData] = useState(undefined);
    const loaded = false;
    const email = 'bsanders@gmail.com';
    const url = 'http://localhost:5000/users/profile';

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email: email },
    };

    useEffect(() => {
        async function fetchMyApi() {
            requestOptions.body.token = await getUserIdToken();
            requestOptions.body = JSON.stringify(requestOptions.body);
            fetch(url, requestOptions)
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

    //TO-DO: add stuff to profile later
    return (
        <div className="text-center">
            <h2>Profile Page</h2>
            <h2>Name: </h2>
            <p>
                {pageData && pageData.firstName} {pageData && pageData.lastName}
            </p>
            <SignOutButton />
        </div>
    );
};

export default Profile;
