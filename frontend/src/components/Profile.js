import React, { useEffect, useState } from 'react';
import SignOutButton from './LogOut';

const Profile = (props) => {
    //call backend route and retrieve response
    const [pageData, setPageData] = useState(undefined);
    const loaded = false;
    const email = 'bsanders@gmail.com';
    const url = 'http://localhost:5000/users/profile';

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
    };


    useEffect(() => {
        fetch(url, requestOptions)
        .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setPageData(result);
                },
                (error) => {
                    console.log(error);
                    setPageData(error);
                }
            )
    }, []);

    //TO-DO: add stuff to profile later
    return (
        <div className='text-center'>
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
