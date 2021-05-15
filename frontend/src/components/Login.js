import React, { useContext } from 'react';
import '../App.css';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { doSocialSignIn } from '../firebase/FirebaseFunctions';
import { makeStyles } from '@material-ui/core/styles';

// Inspired by oliviertassinari on GitHub

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(https://source.unsplash.com/ITFwHdPEED0)`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: 'rgb(50, 50, 50)',
    },
    box: {
        width: '100%',
        marginTop: theme.spacing(1),
        textAlign: 'center',
    },
    click: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: 'rgb(50,50,50)',
    },
}));

const socialSignOn = async (provider) => {
    try {
        await doSocialSignIn(provider);
    } catch (error) {
        alert(error);
    }
};

function Login() {
    const classes = useStyles();
    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return <Redirect to='/' />;
    }

    return (
        <Grid container component='main' className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Welcome to Game Center
                    </Typography>
                    <div className={classes.box}>In order to explore, you must be signed in with a Google account.</div>
                    <Button fullWidth variant='contained' color='primary' className={classes.click} onClick={() => socialSignOn('google')}>
                        Sign In with Google
                    </Button>
                </div>
            </Grid>
        </Grid>
    );
}

export default Login;
