import { makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserIdToken } from '../../firebase/FirebaseFunctions';
const styles = makeStyles({
    inline: {
        display: 'inline',
    },

    card: {
        width: 200,
        height: 300,
        marginLeft: 0,
        marginRight: 10,
        backgroundColor: 'lightgray',
        display: 'inline-block',
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
            boxShadow: '0px 2px 3px 3px rgba(0,0,0,.2)',
        },
    },

    cardNameContainer: {
        position: 'absolute',
        bottom: 0,
        color: 'white',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        maxHeight: 300,
        whiteSpace: 'normal',
    },

    cardCoverImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },

    cardName: {
        margin: 10,
        marginBottom: 20,
    },
});

const PopularCard = (props) => {
    const [coverURL, setCoverURL] = useState('');
    let idToken;
    async function fetchData() {
        if (!idToken) idToken = await getUserIdToken();
        if (props.data.cover) {
            fetch(
                `http://localhost:5000/games/game/cover/${props.data.cover}?idToken=${idToken}`,
                {
                    credentials: 'include',
                }
            )
                .then((res) => res.json())
                .then(
                    (result) => {
                        setCoverURL(result.url);
                    },
                    (error) => {
                        setCoverURL('');
                    }
                );
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const classes = styles();
    return (
        <div className={classes.inline}>
            <Link to={`/game/${props.data.id}`} key={props.data.id}>
                <div className={classes.card}>
                    {coverURL && (
                        <img
                            className={classes.cardCoverImage}
                            src={coverURL}
                            alt="game cover"
                        />
                    )}
                    <div className={classes.cardNameContainer}>
                        <p className={classes.cardName}>{props.data.name}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PopularCard;
