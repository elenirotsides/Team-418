import React, { useEffect, useState } from 'react';

const Home = (props) => {

    const [pageData, setPageData] = useState(undefined);


    useEffect(() => {
        fetch('http://localhost:5000/games', {
            credentials: 'include'
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

    return (
        <div>
            {pageData && <p>We have data and the first game name is {pageData[0].name}!</p>}
        </div>
    );
};

export default Home;
