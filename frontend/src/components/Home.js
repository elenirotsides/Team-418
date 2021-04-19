import React, { useEffect } from 'react';

const Home = (props) => {

    useEffect(() => {
        fetch('http://localhost:5000/games', {
            credentials: 'include',
            mode:'cors'
          }).then(res => res.json())
            .then(
                (result) => {
                    alert(result.text);
                },
                (error) => {

                }
            )
    }, []);

    return (
        <div>
            <p>Home</p>
        </div>
    );
};

export default Home;
