import React, { useState, useContext } from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import '../App.css';
import { Grid, makeStyles } from '@material-ui/core';
import { getUserIdToken } from '../firebase/FirebaseFunctions';
import { doLogOut } from '../firebase/FirebaseFunctions';

const styles = makeStyles({

    navgitation: {
        backgroundColor:'rgb(50,50,50)'
    },

    navIconButton: {
        width: 50,
        height: 50,
        margin: '0px 30px 0px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        border: 0,
    },

    navIconSize: {
        height: '100%',
        width: 'auto',
        padding: '5px 0px 5px 0px'
    },

    navSearchParent: {
        marginTop: 10,
    },

    navSearchBox: {
        display: 'inline',
        marginRight: 10,
        marginLeft: 10
    },

    dropdown: {
        position: 'relative',
        display: 'inline-block'
    },

    dropdownLink: {
        marginBottom:10
    },

    link: {
        color:'white',
        textDecoration:'none'
    }


})

const Navigation = () => {
    const { currentUser } = useContext(AuthContext);
    return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
    const [idToken, setIdToken] = useState(false);
    const classes = styles();
    let history = useHistory();
    async function setUserIdToken() {
        const token = await getUserIdToken();
        setIdToken(token);
    }
    setUserIdToken();

    function changeColorMouseEnter(e) {
        e.target.style.color = '#61dafb';
        e.target.style.textDecoration = 'underline'
        e.target.style.cursor = 'pointer'
    }
    function changeColorMouseLeave(e) {
        e.target.style.color = 'white';
        e.target.style.textDecoration = 'none'
    }

    return (
        <nav className={classes.navgitation}>
            <Grid container>
                <Grid item md={1} sm={2} xs={12}>
                    <div className={classes.navIconButton}>
                        <Link to='/'>
                            <img className={classes.navIconSize} src='/imgs/logo.png' alt='home' />
                        </Link>
                    </div>
                </Grid>
                <Grid item md={10} sm={8} xs={10}>
                    <div className={classes.navSearchParent}>
                        <form className={classes.navSearchBox}>
                            <label>
                                <input type="text" placeholder='Search games...' onChange={(e) => {
                                    // on change here
                                }} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const searchTerm = e.target.value;
                                        e.target.value = '';
                                        history.push('/games/search/0', {searchTerm: searchTerm})
                                        // hit enter
                                    }
                                }} />
                            </label>
                        </form>
                    </div>
                </Grid>
                <Grid item md={1} sm={2} xs={2}>
                    <div className={classes.dropdown}>
                        <button className={`${classes.navIconButton} profileBtn`}>
                        {!idToken && <img className={classes.navIconSize} src='/imgs/profile.png' alt='profile' />}
                        {idToken && <img className={classes.navIconSize} crossorigin="anonymous" src={`http://localhost:5000/users/picture?idToken=${idToken}`} alt='profile' />}
                        </button>
                        <div className='dropdownContent'>
                            <div className={classes.dropdownLink}><a className={classes.link} onMouseEnter={changeColorMouseEnter} onMouseLeave={changeColorMouseLeave} href='/profile'>Profile</a></div>
                            <div className={classes.dropdownLink}><a className={classes.link} onMouseEnter={changeColorMouseEnter} onMouseLeave={changeColorMouseLeave} onClick={doLogOut} href='/login'>Logout</a></div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </nav>
    );
};

const NavigationNonAuth = () => {
    return (
        <Redirect to='/login'/>
    );
};

export default Navigation;
