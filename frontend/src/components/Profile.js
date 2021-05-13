import { makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import SignOutButton from './LogOut';
import { getUserIdToken } from '../firebase/FirebaseFunctions';
import ProfilePictureModal from './ProfilePictureModal';
import GameSizableCard from './Home/GameSizableCard';
const styles = makeStyles({
    title: {
        marginLeft: 60,
    },

    grid: {
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        height: 320,
        paddingLeft: 60,
        paddingRight: 60,
    },

    viewAllLink: {
        position: 'absolute',
        right: 60,
    },

    loading: {
        textAlign: 'center',
    },

    endPadding: {
        display: 'inline',
    },

    navigationArrowsContainer: {
        position: 'relative',
        marginBottom: 10,
    },

    leftArrow: {
        left: 10,
        transform: 'rotate(180deg)',
    },

    rightArrow: {
        right: 10,
    },

    navArrow: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,.6)',
        height: 80,
        width: 60,
        top: 100,
        fontSize: 40,
        color: 'black',
        margin: 0,
        padding: 0,
        lineHeight: 0,
        outline: 'none !important',
        backgroundImage: 'url(/imgs/scrollArrow.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '40px 40px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,.8)',
        },
    },
});

const Profile = () => {
    const [userData, setUserData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [favoriteGames, setFavoriteGames] = useState(false);
    const [favoritesLoading, setfavoritesLoading] = useState(true);
    const [error, setError] = useState(false);
    const [idToken, setIdToken] = useState(false);
    const infoUrl = 'http://localhost:5000/users/profile';
    const favoriteGamesUrl = 'http://localhost:5000/users/profile/favorites';
    const classes = styles();
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    function OnScroll() {
        const scrollView = document.getElementById('favoriteGamesScrollView');
        if (scrollView.scrollLeft <= 70) {
            setShowLeftArrow(false);
        } else {
            setShowLeftArrow(true);
        }

        if (
            Math.round(scrollView.scrollWidth - scrollView.scrollLeft) <=
            scrollView.clientWidth + 70
        ) {
            setShowRightArrow(false);
        } else {
            setShowRightArrow(true);
        }
    }

    async function fetchProfile() {
        let token = idToken;
        if (!idToken) {
            token = await getUserIdToken();
            setIdToken(token);
        }
        try {
            const response = await fetch(`${infoUrl}?idToken=${token}`, {
                method: 'GET',
            });
            const data = await response.json();
            setUserData(data);
            setLoading(false);
        } catch (e) {
            console.log(e);
            setError(true);
        }
    }

    async function fetchFavoriteGames() {
        let token = idToken;
        if (!idToken) {
            token = await getUserIdToken();
            setIdToken(token);
        }
        try {
            const response = await fetch(
                `${favoriteGamesUrl}?idToken=${token}`,
                {
                    method: 'GET',
                }
            );
            const data = await response.json();
            if (data.length < 8) setShowRightArrow(false);
            setFavoriteGames(data);
            setfavoritesLoading(false);
        } catch (e) {
            console.log(e);
            setError(true);
        }
    }

    function createFavoriteGames() {
        if (favoritesLoading) {
            return (
                <div>
                    <p>Loading...</p>
                </div>
            );
        } else if (!favoriteGames || favoriteGames.length === 0) {
            return (
                <div>
                    <p>No favorite games yet.</p>
                </div>
            );
        } else {
            return (
                <div className={classes.navigationArrowsContainer}>
                    <div
                        id="favoriteGamesScrollView"
                        className={`${classes.grid} noScrollbar bg-dark`}
                        onScroll={OnScroll}
                    >
                        {favoriteGames &&
                            favoriteGames.map((game) => {
                                return (
                                    <GameSizableCard
                                        key={game.id}
                                        data={game}
                                        cardWidth={200}
                                        cardHeight={300}
                                        cardMarginRight={10}
                                    />
                                );
                            })}
                        <div className={classes.endPadding}></div>
                        {favoritesLoading && (
                            <h2 className={classes.favoritesLoading}>
                                Loading...
                            </h2>
                        )}
                    </div>
                    {showLeftArrow && (
                        <button
                            className={`${classes.leftArrow} ${classes.navArrow}`}
                            onClick={(e) => {
                                const scrollView = document.getElementById(
                                    'favoriteGamesScrollView'
                                );
                                scrollView.scrollTo({
                                    top: 0,
                                    left: scrollView.scrollLeft - 400,
                                    behavior: 'smooth',
                                });
                            }}
                        ></button>
                    )}

                    {showRightArrow && (
                        <button
                            className={`${classes.rightArrow} ${classes.navArrow}`}
                            onClick={(e) => {
                                const scrollView = document.getElementById(
                                    'favoriteGamesScrollView'
                                );
                                scrollView.scrollTo({
                                    top: 0,
                                    left: scrollView.scrollLeft + 400,
                                    behavior: 'smooth',
                                });
                            }}
                        ></button>
                    )}
                </div>
            );
        }
    }

    useEffect(() => {
        fetchProfile();
        fetchFavoriteGames();
    }, []);

    if (error) {
        return (
            <div class="text-center">
                <h3>Error</h3>
                <p>
                    There was an error loading your profile. Please try
                    reloading the page.
                </p>
            </div>
        );
    } else if (loading) {
        return (
            <div class="text-center">
                <h2>Loading...</h2>
            </div>
        );
    } else {
        return (
            <div className="text-center">
                <h2>Profile Page</h2>
                {!idToken && <img src="/imgs/profile.png" alt="profile" />}
                {idToken && (
                    <img
                        crossOrigin="anonymous"
                        class="my-3 bg-dark"
                        src={`http://localhost:5000/users/picture?idToken=${idToken}`}
                        alt="profile"
                    />
                )}
                <br />
                {idToken && <ProfilePictureModal idToken={idToken} />}
                <h3>Name: </h3>
                <p>
                    {userData && userData.firstName}{' '}
                    {userData && userData.lastName}
                </p>
                <h3>Email: </h3>
                <p>{userData && userData.email}</p>
                <h3>Username: </h3>
                <p>{userData && userData.displayName}</p>
                <h3>Favorite Games</h3>
                {createFavoriteGames()}
                <SignOutButton />
            </div>
        );
    }
};

export default Profile;
