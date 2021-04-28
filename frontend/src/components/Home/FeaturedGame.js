import { makeStyles } from '@material-ui/core';
import SectionTitle from './SectionTitle';

const styles = makeStyles({
    container: {
        position: 'relative',
    },

    backgroundImage: {
        width: '100%',
        backgroundColor: 'lightgray',
        height: 350
    },

    nameContainer: {
        position: 'absolute',
        height: 80,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },

    gameTitle: {
        color: 'white',
        fontSize: 30,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    }
});

const FeaturedGame = (props) => {
    const classes = styles();
    return (
        <div>
            <SectionTitle title='Featured'/>
            <div className={classes.container}>
                <img className={classes.backgroundImage}></img>
                <div className={classes.nameContainer}>
                    <div className={classes.gameTitle}>Game Title</div>
                </div>
            </div>
        </div>
    );
}

export default FeaturedGame;