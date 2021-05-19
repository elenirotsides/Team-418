import { makeStyles } from '@material-ui/core';
import SectionTitle from './SectionTitle';
import ViewAllLink from './ViewAllLink';
import GameSizableCard from './GameSizableCard';
import { useState } from 'react';
import { Link } from 'react-router-dom';


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
    },

    navigationArrowsContainer: {
        position:'relative'
    },

    leftArrow: {
        left:10,
        transform:'rotate(180deg)'
    },

    rightArrow: {
        right:10
    },

    navArrow: {
        position:'absolute',
        backgroundColor:'rgba(255,255,255,.6)',
        height:80,
        width:60,
        top:100,
        fontSize:40,
        color:'black',
        margin:0,
        padding:0,
        lineHeight:0,
        outline:'none !important',
        backgroundImage:'url(/imgs/scrollArrow.png)',
        backgroundRepeat:'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize:'40px 40px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor:'rgba(255,255,255,.8)',
        }
    }
});

const PopularGames = (props) => {

    const classes = styles();
    let cards = null;
    let loading = false;
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    cards = props && props.data && props.data.map((data) => {
        return <GameSizableCard key={data.id} data={data} cardWidth={200} cardHeight={300} cardMarginRight={10} />
    });

    loading = cards == null;

    function OnScroll() {
        const scrollView = document.getElementById('popularGamesScrollView');
        if (scrollView.scrollLeft <= 70) {
            setShowLeftArrow(false);
        } else {
            setShowLeftArrow(true);
        }

        if (Math.round(scrollView.scrollWidth - scrollView.scrollLeft) <= scrollView.clientWidth+70) {
            setShowRightArrow(false);
        } else {
            setShowRightArrow(true);
        }
    }

    return (
        <div>
            <div className={classes.title}>
                <SectionTitle title='Popular Games' />
            </div>
            <div className={classes.navigationArrowsContainer}>
                <div id='popularGamesScrollView' className={`${classes.grid} noScrollbar`} onScroll={OnScroll}>
                    {cards && cards}
                    <div className={classes.endPadding}></div>
                    {loading &&
                        <h2 className={classes.loading}>Loading...</h2>}
                </div>
                {showLeftArrow &&
                    <label htmlFor='left'>
                    <button id='left' className={`${classes.leftArrow} ${classes.navArrow}`} onClick={(e) => {
                        const scrollView = document.getElementById('popularGamesScrollView');
                        scrollView.scrollTo({
                            top: 0,
                            left: scrollView.scrollLeft - 400,
                            behavior: 'smooth'
                        });
                    }}></button></label>
                }

                {showRightArrow &&
                <label htmlFor='right'>
                    <button id='right' className={`${classes.rightArrow} ${classes.navArrow}`} onClick={(e) => {
                        const scrollView = document.getElementById('popularGamesScrollView');
                        scrollView.scrollTo({
                            top: 0,
                            left: scrollView.scrollLeft + 400,
                            behavior: 'smooth'
                        });
                    }}></button></label>
                }
            </div>

            <div className={classes.viewAllLink}>
                <ViewAllLink text='View all popular games' link='/games/allpopular/0' />
            </div>
        </div>
    );
}

export default PopularGames;