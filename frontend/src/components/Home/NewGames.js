import { makeStyles } from '@material-ui/core';
import SectionTitle from './SectionTitle';
import ViewAllLink from './ViewAllLink';

const styles = makeStyles({

    title: {
        marginLeft: 60
    },

    squareCellTop: {
        width:'24%',
        paddingTop:'24%',
        backgroundColor:'lightgray',
        display:'inline-block',
        marginRight:'1%',
        marginBottom:10
    },

    cellTall: {
        width:'36.5%',
        paddingTop:'24%',
        backgroundColor:'lightgray',
        display:'inline-block',
        marginRight:'1%'
    },

    viewAllLink: {
        position:'absolute',
        right:60
    }

});


const NewGames = (props) => {
    const classes = styles();
    return (
        <div>
            <SectionTitle title='New Games' />
            <div>
                <div className={classes.squareCellTop}>
                    {props.data[0].name}
                </div>
                <div className={classes.squareCellTop}>
                {props.data[1].name}
                </div>
                <div className={classes.squareCellTop}>
                {props.data[2].name}
                </div>
                <div className={classes.squareCellTop}>
                {props.data[3].name}
                </div>

                <div>
                    <div className={classes.cellTall}>
                    {props.data[4].name}
                    </div>
                    <div className={classes.cellTall}>
                    {props.data[5].name}
                    </div>
                    <div className={classes.squareCellTop}>
                    {props.data[6].name}
                    </div>

                </div>
                <div className={classes.viewAllLink}>
                    <ViewAllLink text='View all new games'/>
                </div>

            </div>
        </div>
    );
}

export default NewGames;