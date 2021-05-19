import { makeStyles } from '@material-ui/core';
const styles = makeStyles({
    buttons: {
        color: 'white',
        backgroundColor: '#0061c9',
    },
});

const ViewAllLink = (props) => {
    const classes = styles();
    console.log(props)
    return <a className={classes.buttons} href={props.link} role="button">{props.text}</a>
}

export default ViewAllLink;
