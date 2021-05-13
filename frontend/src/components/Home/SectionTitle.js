import { makeStyles } from '@material-ui/core';

const styles = makeStyles({
    title: {
        fontSize:24
    }
});

const SectionTitle = (props) => {
    const classes = styles();
    return (
        <p className={classes.title}>{props.title}</p>
    )
}

export default SectionTitle;