import { Link } from 'react-router-dom';
import {makeStyles } from '@material-ui/core';
import SectionTitle from './SectionTitle';
import ViewAllLink from './ViewAllLink';
import { useEffect, useState } from 'react';
import GameSizableCard from './GameSizableCard';


const styles = makeStyles({

    title: {
        marginLeft:60
    },

    grid: {
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        height: 320,
        paddingLeft: 60,
        paddingRight: 60
    },

    viewAllLink: {
        position:'absolute',
        right:60
    },

    loading: {
        textAlign:'center'
    },

    endPadding: {
        display:'inline',
    }

});

const PopularGames = (props) => {

    const classes = styles();
    let cards = null;
    let loading = false;

    cards = props && props.data && props.data.map((data) => {
        return <GameSizableCard key={data.id} data={data} cardWidth={200} cardHeight={300} cardMarginRight={10} />
    });

    loading = cards == null;

    return (
        <div>
            <div className={classes.title}>
                <SectionTitle title='Popular Games' />
            </div>
            <div className={`${classes.grid} popularGamesScroll`}>
                {cards && cards}
                <div className={classes.endPadding}></div>
                {loading && 
                <h2 className={classes.loading}>Loading...</h2>}
            </div>
            
            <div className={classes.viewAllLink}>
                    <ViewAllLink text='View all popular games'/>
                </div>
        </div>
    );
}

export default PopularGames;