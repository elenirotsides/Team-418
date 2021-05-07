import { makeStyles } from '@material-ui/core';
import { useState } from 'react'
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
    }
};

const styles = makeStyles({
    container: {
        textAlign:'center'
    },

    image: {
        maxHeight:'70vh',
        display:'block',
    },

    button: {
        textAlign:'center',
        marginTop:10
    }
});


const ScreenshotModal = (props) => {
    const classes = styles();
    const [showModal, setShowModal] = useState(props.isOpen);

    const handleCloseAddModal = () => {
        setShowModal(false);
        props.handleClose(false);
    };

    return (
        <div>
            <ReactModal
                name="ScreenshotModal"
                isOpen={showModal}
                contentLabel='Screenshot'
                style={customStyles}>
                <div className={classes.container}>
                    <img className={classes.image} src={props.url} alt='Screenshot'/>
                    <button className={classes.button}  onClick={handleCloseAddModal}>Close</button>
                </div>
            </ReactModal>
        </div>
    );
}

export default ScreenshotModal;