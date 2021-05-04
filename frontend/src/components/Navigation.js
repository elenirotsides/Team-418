import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LogOutButton from './LogOut';
import { AuthContext } from '../firebase/Auth';
import '../App.css';
import { Grid, makeStyles } from '@material-ui/core';


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
    
    advancedSearchContainer: {
        display:'inline',
        position: 'absolute',
        bottom:8,
    },

    advancedSearchLink: {
        display: 'inline',
        marginTop: 25,
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
    const classes = styles();
    return (
        <nav className={classes.navgitation}>
            <Grid container>
                <Grid item md={1} sm={2} xs={12}>
                    <div className={classes.navIconButton}>
                        <Link to='/'>
                            <img className={classes.navIconSize} src='imgs/logo.png' alt='home' />
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
                                        // hit enter
                                    }
                                }} />
                            </label>
                        </form>
                        <div className={classes.advancedSearchContainer}>
                            <a className={`${classes.advancedSearchLink} ${classes.link}`} href='/advancedsearch'>Advanced Search</a>
                        </div>
                    </div>
                </Grid>
                <Grid item md={1} sm={2} xs={2}>
                    <div className={classes.dropdown}>
                        <button className={`${classes.navIconButton} profileBtn`}>
                            <img className={classes.navIconSize} src='imgs/profile.png' alt='profile' />
                        </button>
                        <div className='dropdownContent'>
                            <div className={classes.dropdownLink}><a className={classes.link} href='/profile'>Profile</a></div>
                            <div className={classes.dropdownLink}><a className={classes.link} href='/logout'>Logout</a></div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </nav>
    );
};

// I don't know how much we want to show if a user isn't logged in, but this can easily be changed to show more
// I figured it might be easier to start off like this and then slowly progress into the trickier stuff (ie showing everything but
// not allowing certain actions to occur like giving comments, ratings, etc)
const NavigationNonAuth = () => {
    return (
        <nav className="navigation">
            <NavLink exact to="/login" activeClassName="active" className="navlink">
                Log In
            </NavLink>

            <NavLink exact to="/signup" activeClassName="active" className="navlink">
                Sign Up
            </NavLink>
        </nav>
    );
};

export default Navigation;
