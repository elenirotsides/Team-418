import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { makeStyles } from '@material-ui/core';

const styles = makeStyles({
    buttons: {
        color: 'white',
        backgroundColor: '#0061c9',
    },
});

const ProfilePictureModal = (props) => {
    const classes = styles();
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(false);
    const url = `http://localhost:5000/users/picture?idToken=${props.idToken}`;
    const validFileExts = ['.jpg', '.jpeg', '.gif', '.png', '.JPG', '.JPEG', '.GIF', '.PNG'];
    const maxFileSize = 2 * 1024 * 1024;
    const maxFileSizeString = '2MB';
    
    const handleClose = async (e) => {
        setShow(false);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    function validateFileExt() {
        const fileName = String(file.name);
        const extStart = fileName.lastIndexOf('.');
        return validFileExts.includes(fileName.slice(extStart));
    }

    function validateFileSize() {
        return file.size < maxFileSize;
    }

    async function handleForm(e) {
        e.preventDefault();
        const errorDiv = document.getElementById('errorDiv');
        errorDiv.innerHTML = '';
        const errorP = document.createElement('p');
        errorP.className = 'text-danger';
        if (file) {
            try {
                if (!validateFileExt()) {
                    errorP.textContent = `Invalid file type, profile picture can only be [${validFileExts.join(
                        ', '
                    )}]`;
                    errorDiv.appendChild(errorP);
                    return;
                }
                if (!validateFileSize()) {
                    errorP.textContent = `Invalid file size, profile picture can only be up to ${maxFileSizeString}.`;
                    errorDiv.appendChild(errorP);
                    return;
                }
                let formData = new FormData();
                formData.append('profilePicture', file);
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });
                if (response.status != 200)
                    throw 'Profile picture update failed';
                window.location.reload(false);
            } catch (err) {
                errorP.textContent = 'Error uploading file';
                errorDiv.appendChild(errorP);
            }
        } else {
            errorP.textContent = 'No file selected.';
            errorDiv.appendChild(errorP);
        }
    }

    const handleShow = () => setShow(true);

    return (
        <div>
            <Button className={classes.buttons} onClick={handleShow}>
                Change Profile Picture
            </Button>
            <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Upload new profile picture
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleForm}>
                        <div id="errorDiv"></div>
                        <Form.Group controlId="newProfilePicture">
                            <Form.Label>Image File</Form.Label>
                            <Form.Control
                                name="pictureFile"
                                type="file"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                        <Button className={classes.buttons} type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={classes.buttons} onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProfilePictureModal;
