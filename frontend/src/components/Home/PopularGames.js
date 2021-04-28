import { Link } from 'react-router-dom';
import {makeStyles } from '@material-ui/core';
import SectionTitle from './SectionTitle';
import ViewAllLink from './ViewAllLink';


const styles = makeStyles({

    title: {
        marginLeft:60
    },

    grid: {
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        height: 320,
        width: '100%',
        paddingLeft: 60,
        paddingRight: 60
    },

    card: {
        width: 200,
        height: 300,
        marginLeft: 0,
        marginRight: 10,
        backgroundColor: 'lightgray',
        display: 'inline-block',
        position:'relative',
        cursor:'pointer',
        '&:hover': {
            boxShadow: '0px 2px 3px 3px rgba(0,0,0,.2)'
        }
    },

    cardNameContainer: {
        position:'absolute',
        bottom:0,
        color:'white',
        width:'100%',
        backgroundColor:'rgba(0,0,0,0.3)',
        maxHeight:300,
        whiteSpace: 'normal'

    },

    cardName: {
        margin:10,
        marginBottom:20
    },

    viewAllLink: {
        position:'absolute',
        right:60
    }

});

const PopularGames = (props) => {

    const classes = styles();
    let cards = null;

    const buildCard = (data) => {
        return (
            <Link to={`/game/${data.id}`} key={data.id}>
                <div className={classes.card} >
                    <div className={classes.cardNameContainer}>
                        <p className={classes.cardName}>
                            {data.name}
                        </p>
                    </div>
                </div>
            </Link>
        )
    };

    function cardClick(id) {
        fetch(`http://localhost:5000/game/${id}`, {
            credentials: 'include'
        }).then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    cards = props && props.data.map((data) => {
        return buildCard(data);
    })

    return (
        <div>
            <div className={classes.title}>
                <SectionTitle title='Popular Games' />
            </div>
            <div className={`${classes.grid} popularGamesScroll`}>
                {cards}
            </div>
            
            <div className={classes.viewAllLink}>
                    <ViewAllLink text='View all new games'/>
                </div>
        </div>
    );
}

export default PopularGames;