import React from 'react';
import logo from '../notFound404.gif';
import { makeStyles, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

const styles = makeStyles({
    notFound: {
        display: 'flex',
        justifyContent: 'center'
        },

    notFoundImg: {
        display: 'block',
        margin: '0 auto'
    }
});

const NotFound = (props) => {
    const classes = styles();
    return (
        <div >
        <Typography class={classes.notFound}  variant="h1" gutterBottom>
        Error
      </Typography>
      {(<img class={classes.notFoundImg} src={logo} alt="Error 404 Not Found" />
) || <p>"Error 404, resource not found"</p>}

        </div>
    );
};

export default NotFound;
