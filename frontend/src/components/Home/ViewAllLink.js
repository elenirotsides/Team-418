import { makeStyles } from '@material-ui/core';


const styles = makeStyles({
    link: {
        fontSize:18,
        cursor: 'pointer'
    }
});

const ViewAllLink = (props) => {
    const classses = styles();
    return (
        <div>
            <div className={classses.link}>{`${props.text} >`}</div>
        </div>
    );
}

export default ViewAllLink;