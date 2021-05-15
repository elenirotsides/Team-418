import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Rating } from '@material-ui/lab';
import { getUserIdToken } from '../../firebase/FirebaseFunctions';

const GameReviewModal = (props) => {
    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewId, setReviewId] = useState('');
    const [loading, setLoading] = useState(true);
    const [reviewed, setReviewed] = useState(false);
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
        try {
            const response = await fetch(`${reviewUrl}?idToken=${idToken}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (response.status !== 200) throw 'Failed to submit review.';
            setShow(false);
            setReviewed(true);
            props.setReloadReviews(true);
            fetchReviewData();
        } catch (error) {
            errorP.innerText =
                'Failed to submit review. Please reload the page and try again.';
            errorDiv.appendChild(errorP);
        }
    }

    const handleShow = () => setShow(true);

    async function fetchReviewData() {
        let idToken = await getUserIdToken();
        try {
            const response = await fetch(
                `${reviewUrl}/${props.gameId}/user?idToken=${idToken}`,
                {
                    method: 'GET',
                }
            );
            if (response.status === 200) {
                let data = await response.json();
                setRating(data.rating);
                setComment(data.comment);
                setReviewId(data._id);
                setReviewed(true);
            } else if (response.status !== 404) {
                throw "Failed to load user's previous review.";
            }
            setLoading(false);
        } catch (e) {
            // if there is an error it won't unlock the review button
            console.log('error fetching users preview review', e);
        }
    }

    async function deleteReview(e) {
        const errorDiv = document.getElementById('errorDiv');
        errorDiv.innerHTML = '';
        const errorP = document.createElement('p');
        errorP.className = 'text-danger';
        try {
            let token = await getUserIdToken();
            const response = await fetch(
                `${reviewUrl}/${reviewId}?idToken=${token}`,
                {
                    method: 'DELETE',
                }
            );
            if (response.status === 200) {
                setShow(false);
                props.setReloadReviews(true);
                setReviewed(false);
                setComment('');
                setRating(5);
            } else {
                console.log(response.status);
                errorP.innerText =
                    'Failed to delete review. Please reload the page and try again.';
                errorDiv.appendChild(errorP);
            }
        } catch (e) {
            console.log('error deleting review', e);
        }
    }

    useEffect(() => {
        fetchReviewData();
    }, []);

    if (loading) {
        return (
            <Button variant="primary" disabled>
                Add a review
            </Button>
        );
    } else {
        return (
            <div>
                <Button variant="primary" className = "mx-3" onClick={handleShow}>
                    {reviewed ? 'Edit Review' : 'Add Review'}
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
                                    defaultValue={rating || 5}
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
                                    defaultValue={comment}
                                />
                            </Form.Group>
                            <Button
                                className="mx-3"
                                variant="primary"
                                type="submit"
                            >
                                {reviewed ? 'Update Review' : 'Submit Review'}
                            </Button>
                            {reviewed && (
                                <Button
                                    variant="danger"
                                    type="button"
                                    onClick={deleteReview}
                                >
                                    Delete Review
                                </Button>
                            )}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
};

export default GameReviewModal;
