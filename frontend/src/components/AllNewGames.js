import { makeStyles } from '@material-ui/core';
import GameSizableCard from './Home/GameSizableCard';
import { useState, useEffect } from 'react';
import { getUserIdToken } from '../firebase/FirebaseFunctions';

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

const AllNewGames = (props) => {
    const [newData, setNewData] = useState(undefined);
    let idToken;
    let cardList = null;
    const classes = styles();

    async function fetchData() {
        if (!idToken) idToken = await getUserIdToken();

        //gets all new games
        fetch(`http://localhost:5000/games/allnew?idToken=${idToken}`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    setNewData(result);
                },
                (error) => {
                    setNewData(null);
                }
            );
    }

    useEffect(() => {
        fetchData();
    }, []);

    cardList = newData && newData.map((data) => {
        return <GameSizableCard 
                    key={data.id} data={data} cardWidth={'24%'} 
                    cardPaddingTop={'24%'} cardMarginRight={'1%'} 
                />
    });

    return (
        <div className={classes.grid}>
            <h1 className={classes.title}> All New Games </h1>
            {cardList}
        </div>
    );
};

export default AllNewGames;