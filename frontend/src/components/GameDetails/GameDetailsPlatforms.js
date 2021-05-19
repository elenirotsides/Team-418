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
        // replace jpeg with png for url
        p.platform_logo.url = p.platform_logo.url.substr(0, p.platform_logo.url.lastIndexOf(".")) + ".png";
        //replace thumb with icon
        p.platform_logo.url = p.platform_logo.url.replace('t_thumb', 't_logo_med');
        return (
                <Grid key={p.name} className={classes.item} item xs={12} sm={2} md={4}>
                    {p && p.platform_logo && p.platform_logo.url &&
                    <img className={classes.img} src={p.platform_logo.url} alt='icon'/> }
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