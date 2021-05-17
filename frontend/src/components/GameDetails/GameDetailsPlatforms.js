import {Grid, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';

const styles = makeStyles({
    item: {
        display:'inline',
        marginBottom:20,
        textAlign:'center'
    },
    img: {
        width:60,
        height:60,
        objectFit:'contain'
    }
});


const GameDetailsPlatforms = (props) => {
    const classes = styles();
    let platforms = [];


    platforms = props.data.platforms && props.data.platforms.map((p) => {
        return (
                <Grid className={classes.item} item spacing={10} xs={12} s={2} md={4}>
                    <img className={classes.img} src={p.platform_logo.url} alt='icon'/>
                    <div>{p.name}</div>
                </Grid>
        )
    })

    return (
        <div>
            <h5>Platforms</h5>
            <Grid container justify='center' alignItems='center'>
                {platforms}
            </Grid>
        </div>
    )
}

export default GameDetailsPlatforms;