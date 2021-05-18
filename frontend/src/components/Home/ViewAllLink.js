import { makeStyles } from '@material-ui/core';

const styles = makeStyles({
    buttons: {
        color: 'white',
        backgroundColor: '#0061c9',
    },
});

const ViewAllLink = (props) => {
    const classes = styles();
    return (
        <div>
            <button className={`btn ${classes.buttons}`}>{`${props.text} >`}</button>
        </div>
    );
}

export default ViewAllLink;