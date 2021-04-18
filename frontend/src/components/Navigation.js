import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import LogOutButton from './LogOut';
import { AuthContext } from '../firebase/Auth';
import '../App.css';

const Navigation = () => {
    const { currentUser } = useContext(AuthContext);
    return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
    return (
        <nav className="navigation">
            <NavLink exact to="/" activeClassName="active" className="navlink">
                Home
            </NavLink>

            <NavLink exact to="/profile" activeClassName="active" className="navlink">
                Profile
            </NavLink>

            <NavLink exact to="/advancedsearch" activeClassName="active" className="navlink">
                Advanced Search
            </NavLink>

            <NavLink exact to="/results/test" activeClassName="active" className="navlink">
                Results
            </NavLink>

            <NavLink exact to="/game/1" activeClassName="active" className="navlink">
                Game
            </NavLink>

            <LogOutButton />
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
