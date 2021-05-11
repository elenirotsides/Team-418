import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const GameReviewModal = (props) => {
    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(false);
    const url = `http://localhost:5000/reviews?idToken=${props.idToken}`;
    
    const handleClose = async (e) => {
        setShow(false);
    };

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    async function handleForm(e) {
        e.preventDefault();
        const errorDiv = document.getElementById('errorDiv');
        errorDiv.innerHTML = '';
        const errorP = document.createElement('p');
        errorP.className = 'text-danger';
    }

    const handleShow = () => setShow(true);

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                Review Game
            </Button>
            <Modal
                show={show}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Game Review
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleForm}>
                        <div id="errorDiv"></div>
                        <Form.Group controlId="rating">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                name="rating"
                                type="number"
                                onChange={handleRatingChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default GameReviewModal;
