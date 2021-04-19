import React, { useState, useEffect } from 'react';
import firebaseApp from './Firebase';

export const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged((user) => {
            setCurrentUser(user);
            setPending(false);
        });
    }, []);

    if (pending) {
        return <div>Loading...</div>;
    }

    return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
};
