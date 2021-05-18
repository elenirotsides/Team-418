import {Grid, makeStyles } from '@material-ui/core';

const styles = makeStyles({
    item: {
        display:'inline',
        marginBottom:20,
        textAlign:'center',
        minWidth:100
    },
    img: {
        width:60,
        height:60,
        objectFit:'contain'
    },
    title: {
        fontSize:20
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
            <h1 className={classes.title}>Platforms</h1>
            <Grid container justify='center' alignItems='center'>
                {platforms}
            </Grid>
        </div>
    )
}

export default GameDetailsPlatforms;