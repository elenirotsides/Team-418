import { makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';

const styles = makeStyles({
    center:{
        textAlign:'center'
    }
});

const GameMoreDetails = (props) => {
    const classes = styles();
    const [releaseDate, setReleaseDate] = useState('');
    const [genres, setGenres] = useState('');
    const [companies, setCompanies] = useState('');
    const [playerPerspectives, setPlayerPerspectives] = useState('');
    const [themes, setThemes] = useState('');
    const [modes, setModes] = useState('');



    useEffect(() => {
        // date
        if (props.data.first_release_date) {
            const rawReleaseDate = new Date(props.data.first_release_date * 1000);
            setReleaseDate(`${rawReleaseDate.getMonth() + 1}\/${rawReleaseDate.getDate()}\/${rawReleaseDate.getFullYear()}`);
        }

        // all companies
        if (props.data.involved_companies) {
            let companiesString = '';
            props.data.involved_companies.forEach(c => {
                companiesString += `${c.company.name}, `
            });
            setCompanies(companiesString.slice(0, -2));
        }


        // genres
        if (props.data.genres) {
            let genresString = '';
            props.data.genres.forEach(g => {
                genresString += `${g.name}, `
            });
            setGenres(genresString.slice(0, -2));
        }

        // player perspectives
        if (props.data.player_perspectives) {
            let playerPerspectivesString = '';
            props.data.player_perspectives.forEach(g => {
                playerPerspectivesString += `${g.name}, `
            });
            setPlayerPerspectives(playerPerspectivesString.slice(0, -2));
        }

        // player perspectives
        if (props.data.themes) {
            let themesString = '';
            props.data.themes.forEach(g => {
                themesString += `${g.name}, `
            });
            setThemes(themesString.slice(0, -2));
        }

        // game modes 
        if (props.data.game_modes) {
            let modesString = '';
            props.data.game_modes.forEach(g => {
                modesString += `${g.name}, `
            });
            setModes(modesString.slice(0, -2));
        }

        // 
    }, []);


    return (
        <div className={classes.center}>
            <dl>
                {companies && <dt>Companies</dt>}
                <dd>{companies}</dd>
                {releaseDate && <dt>Release Date</dt>}
                <dd>{releaseDate}</dd>
                {genres && <dt>Genres</dt>}
                <dd>{genres}</dd>
                {themes && <dt>Themes</dt>}
                <dd>{themes}</dd>
                {playerPerspectives && <dt>Player Perspectives</dt>}
                <dd>{playerPerspectives}</dd>
                {modes && <dt>Game Modes</dt>}
                <dd>{modes}</dd>
            </dl>
        </div>
    );


}

export default GameMoreDetails;
