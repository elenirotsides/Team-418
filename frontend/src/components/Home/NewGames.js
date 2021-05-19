import { makeStyles } from '@material-ui/core';
import SectionTitle from './SectionTitle';
import ViewAllLink from './ViewAllLink';
import GameSizableCard from './GameSizableCard'
import { Link } from 'react-router-dom';

const styles = makeStyles({

    title: {
        marginLeft: 60
    },

    viewAllLink: {
        position:'absolute',
        right:60
    },

    verticalSpacing: {
        marginBottom:'.5%'
    },

    loadingContainer: {
        height:350,
        backgroundColor:'lightgray',
        position:'relative'
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

const NewGames = (props) => {
    const classes = styles();

    if (props.data == null || props.data.length === 0) {
        return (
            <div>
            <SectionTitle title='New Games' />
            <div className={classes.loadingContainer}>
                <h2 className={classes.loading}>Loading...</h2>
            </div>
        </div>
        )
    }
    return (
        <div>
            <SectionTitle title='New Games' />
            <div>
                <div className={classes.verticalSpacing}>
                <GameSizableCard data={props.data[0]} cardWidth={'24%'} cardPaddingTop={'24%'} cardMarginRight={'1%'}/>
                <GameSizableCard data={props.data[1]} cardWidth={'24%'} cardPaddingTop={'24%'} cardMarginRight={'1%'}/>
                <GameSizableCard data={props.data[2]} cardWidth={'24%'} cardPaddingTop={'24%'} cardMarginRight={'1%'}/>
                <GameSizableCard data={props.data[3]} cardWidth={'24%'} cardPaddingTop={'24%'} cardMarginRight={'1%'}/>
                </div>
                <div>
                <GameSizableCard data={props.data[4]} cardWidth={'36.5%'} cardPaddingTop={'24%'} cardMarginRight={'1%'}/>
                <GameSizableCard data={props.data[5]} cardWidth={'36.5%'} cardPaddingTop={'24%'} cardMarginRight={'1%'}/>

                <GameSizableCard data={props.data[6]} cardWidth={'24%'} cardPaddingTop={'24%'} cardMarginRight={'1%'}/>


                </div>
                <div className={classes.viewAllLink}>
                    <ViewAllLink text='View all new games' link='/games/allnew/0' />
                </div>

            </div>
        </div>
    );
}

export default NewGames;