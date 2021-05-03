import React, { useEffect, useState } from 'react';
import FeaturedGame from './FeaturedGame';
import { makeStyles } from '@material-ui/core';
import PopularGames from './PopularGames';
import NewGames from './NewGames';


const styles = makeStyles({

    defaultSectionMargin: {
        marginTop: 60
    },

    defaultSideMargin: {
        marginLeft: 60,
        marginRight: 60
    }
})



const Home = (props) => {

    const classes = styles();

    const [featuredData, setFeaturedData] = useState(undefined);
    const [popularData, setPopularData] = useState(undefined);
    const [newGamesData, setNewGamesData] = useState(undefined);


    useEffect(() => {

         // get featured games
         fetch('http://localhost:5000/games/featured', {
            credentials: 'include'
        }).then(res => res.json())
            .then(
                (result) => {
                    setFeaturedData(result);
                },
                (error) => {
                    setFeaturedData(null);
                }
            )

        // get popular games
        fetch('http://localhost:5000/games/popular', {
            credentials: 'include'
        }).then(res => res.json())
            .then(
                (result) => {
                    setPopularData(result);
                },
                (error) => {
                    setPopularData(null);
                }
            )

        // get new games
        fetch('http://localhost:5000/games/new', {
            credentials: 'include'
        }).then(res => res.json())
            .then(
                (result) => {
                    setNewGamesData(result);
                },
                (error) => {
                    setNewGamesData(null);
                }
            )
    }, []);

    return (
        <div>
            <div className={`${classes.defaultSideMargin} ${classes.defaultSectionMargin}`}>
                <FeaturedGame data={featuredData} />
            </div>

            <div className={`${classes.defaultSectionMargin}`}>
                <PopularGames data={popularData} />
            </div>

            <div className={`${classes.defaultSideMargin} ${classes.defaultSectionMargin}`}>
                <NewGames data={newGamesData} />
            </div>

            <div className={`${classes.defaultSideMargin} ${classes.defaultSectionMargin}`}></div>
        </div>
    );
};

export default Home;
