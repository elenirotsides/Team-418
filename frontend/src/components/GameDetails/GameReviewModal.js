import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Rating } from '@material-ui/lab';
import { getUserIdToken } from '../../firebase/FirebaseFunctions';

const GameReviewModal = (props) => {
    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState(false);
    const reviewUrl = `http://localhost:5000/reviews`;

    const handleClose = async () => {
        setShow(false);
    };

    const handleRatingChange = (e) => {
        setRating(Number.parseInt(e.target.value));
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    async function handleForm(e) {
        e.preventDefault();
        const errorDiv = document.getElementById('errorDiv');
        errorDiv.innerHTML = '';
        const errorP = document.createElement('p');
        errorP.className = 'text-danger';
        let body = {};
        body['gameId'] = Number.parseInt(props.gameId);
        body['rating'] = rating;
        // add comment if given
        if (comment) body['comment'] = comment;
        let idToken = await getUserIdToken();
        console.log('body', body);
        try {
            const response = await fetch(`${reviewUrl}?idToken=${idToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            console.log(response);
            if (response.status !== 200) throw 'Failed to submit review.';
            setShow(false);
        } catch (error) {
            errorP.innerText =
                'Failed to submit review. Please reload the page and try again.';
            errorDiv.appendChild(errorP);
        }
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
                            <br />
                            <Rating
                                name="size-large"
                                onChange={handleRatingChange}
                                defaultValue={5}
                                min={1}
                                max={10}
                                size="large"
                            />
                        </Form.Group>
                        <Form.Group controlId="comment">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                name="comment"
                                type="textarea"
                                onChange={handleCommentChange}
                                as="textarea"
                                rows={3}
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
