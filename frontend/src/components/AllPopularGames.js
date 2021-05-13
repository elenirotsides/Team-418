import { makeStyles } from '@material-ui/core';
import GameSizableCard from './Home/GameSizableCard';
import { useState, useEffect } from 'react';
import { getUserIdToken } from '../firebase/FirebaseFunctions';
import SectionTitle from './Home/SectionTitle';

const styles = makeStyles({
    title: {
        textAlign: 'center',
        paddingTop: 60,
        paddingBottom: 45
    },

    grid: {
        paddingLeft: 60,
        paddingRight: 60
    }
});

const AllPopularGames = (props) => {
    const [popularData, setPopularData] = useState(undefined);
    let idToken;
    let cardList = null;
    const classes = styles();

    async function fetchData() {
        if (!idToken) idToken = await getUserIdToken();

        // get all popular games
        fetch(`http://localhost:5000/games/allpopular?idToken=${idToken}`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    setPopularData(result);
                },
                (error) => {
                    setPopularData(null);
                }
            );
    }

    useEffect(() => {
        fetchData();
    }, []);

    cardList = popularData && popularData && popularData.map((data) => {
        return <GameSizableCard 
                    key={data.id} data={data} cardWidth={'24%'} 
                    cardPaddingTop={'24%'} cardMarginRight={'1%'} 
                />
    });

    return (
        <div className={classes.grid}>
            <h1 className={classes.title}> All Popular Games </h1>
            {cardList}
        </div>
    );
};

export default AllPopularGames;