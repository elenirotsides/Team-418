import React, { useEffect, useState } from 'react';
import SignOutButton from './LogOut';
import ChangePassword from './ChangePassword';

const Profile = (props) => {
    //call backend route and retrieve response
    const [pageData, setPageData] = useState(undefined);
    const loaded = false;
    const email = 'bsanders@gmail.com';
    const url = 'http://localhost:5000/users/profile/' + email;
    useEffect(() => {
        fetch(url, {
           
          }).then(res => res.json())
            .then(
                (result) => {
                    setPageData(result);
                },
                (error) => {
                    setPageData(error);
                }
            )
    }, []);

    //TO-DO: add stuff to profile later
    return (
        <div className="text-center">
            <h2>Profile Page</h2>
            <h2>Name: </h2>
            <ChangePassword />
            <SignOutButton />
        </div>
    );
};


export default Profile;
