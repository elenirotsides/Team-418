import { makeStyles } from '@material-ui/core';
import SectionTitle from './SectionTitle';
import { Link } from 'react-router-dom';


const styles = makeStyles({
    container: {
        position: 'relative',
        height: 350,
        backgroundColor: 'lightgray',
    },

    backgroundImage: {
        width: '100%',
        backgroundColor: 'lightgray',
        height: 350,
        objectFit: 'cover'
    },

    nameContainer: {
        position: 'absolute',
        height: 80,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },

    gameTitle: {
        color: 'white',
        fontSize: 30,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    },

    loading: {
        position:'absolute',
        color:'white',
        textAlign:'center',
        left:'50%',
        top:'50%',
        transform: 'translate(-50%, -50%)'
    }
});

const FeaturedGame = (props) => {
    const classes = styles();
    if (props.data == null) {
        return (
            <div>
                <SectionTitle title='Featured' />
                <div className={classes.container}>
                    <h2 className={classes.loading}>Loading...</h2>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <SectionTitle title='Featured' />
                <Link to={`/game/${props.data.igdbData[0].id}`} key={props.data.id}>
                    <div className={classes.container}>
                        <img alt='Featured Game Image' className={classes.backgroundImage} src={props.data.banner}></img>
                        <div className={classes.nameContainer}>
                            <div className={classes.gameTitle}>{props.data.igdbData[0].name}</div>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default FeaturedGame;