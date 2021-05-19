import React, { useEffect, useState } from 'react';
import { getUserIdToken } from '../firebase/FirebaseFunctions';
import GameSizableCard from './Home/GameSizableCard';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

const styles = makeStyles({
    page: {
        margin:60
    },

    nextBtn: {
        marginLeft:10
    },

    prevBtn: {
        marginRight:10
    },
     
    card: {
        marginBottom:20,
        display:'inline'
    },

    buttons: {
        color: 'white',
        backgroundColor: '#0061c9',
    },

    customTitle:{
        fontSize:24
    }
});

const Search = (props) => {
    const classes = styles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [pageData, setPageData] = useState(undefined);
    const [searchInfo, setSearchInfo] = useState(undefined);
    const [genre, setGenre] = useState(undefined);
    const [platform, setPlatform] = useState(undefined);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [locationPathName, setLocationPathName] = useState('');
    const [customTitle, setCustomTitle] = useState('');

    let idToken;
    const searchInfoUrl = 'http://localhost:5000/games/search/info';
    let history = useHistory();

    
    async function search(e, redirectedSearchTerm, page) {
        let searchUrl = `http://localhost:5000/games/search/${page}`;

        let searchTerm;
        if (redirectedSearchTerm) {
            searchTerm = redirectedSearchTerm;
        } else {
            e.preventDefault();
            setError(false);
            searchTerm = e.target[0].value;
        }
        if (!searchTerm) return setError('Search term cannot be empty.');
        if (!idToken) idToken = await getUserIdToken();
        try {
            setLoading(true);
            setPageData(undefined);
            let body = {
                searchTerm: searchTerm,
                idToken: idToken,
            };
            if (genre && genre !== '-1') body['genres'] = genre;
            if (platform && platform !== '-1') body['platforms'] = platform;
            const requestInfo = {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            };
            const response = await fetch(searchUrl, requestInfo);
            const data = await response.json();
            setPageData(data);
            
            setShowPrev(props.match.params.pageNum > 0)
            setShowNext(data.length === 12);
        } catch (err) {
            setError(true);
        }
        setLoading(false);
    }

    async function getSearchInfo() {
        try {
            if (!idToken) idToken = await getUserIdToken();
            setLoading(true);
            const requestInfo = {
                credentials: 'include',
                method: 'GET',
            };
            const response = await fetch(
                `${searchInfoUrl}?idToken=${idToken}`,
                requestInfo
            );
            setSearchInfo(await response.json());
        } catch (err) {
            setError(true);
        }
        setLoading(false);
    }
    function createGameCards() {
        if (pageData && pageData.length === 0) {
            return (
                <div className="text-center">
                    <h2>No Games Found.</h2>
                </div>
            );
        } 
        else {
            return (
                <div key='cards' className="ml-3 mr-2">
                    {pageData &&
                        pageData.map((game) => {
                            return (
                                <GameSizableCard
                                    key={game.id}
                                    data={game}
                                    cardWidth={'24%'}
                                    cardPaddingTop={'24%'}
                                    cardMarginRight={'0.5%'}
                                />
                            );
                        })}
                </div>
            );
        }
    }

    async function fetchPopularGames() {
        if (!idToken) idToken = await getUserIdToken();

        setLoading(true);
        // get popular games
        fetch(`http://localhost:5000/games/popular?idToken=${idToken}&type=all&page=${props.match.params.pageNum}`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    setLoading(false);
                    setPageData(result);
                    setShowPrev(props.match.params.pageNum > 0)
                    setShowNext(result.length === 12);
                },
                (error) => {
                    setLoading(false);
                    setError(true);
                }
            );
    }

    async function fetchNewGames() {
        if (!idToken) idToken = await getUserIdToken();

        setLoading(true);
        // get popular games
        fetch(`http://localhost:5000/games/new?idToken=${idToken}&type=all&page=${props.match.params.pageNum}`, {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    setLoading(false);
                    setPageData(result);
                    setShowPrev(props.match.params.pageNum > 0)
                    setShowNext(result.length === 12);
                },
                (error) => {
                    setLoading(false);
                    setError(true);
                }
            );
    }

    function validFormInput(e) {
        const searchTerm = e && e.target && e.target[0] && e.target[0].value;
        return searchTerm && searchTerm.trim();
    }

    useEffect(() => {
        if (props.location.pathname.includes('/games/allpopular')) {
            // reuse search page for popular games
            setLocationPathName('/games/allpopular/')
            setCustomTitle('Games by popularity');
            fetchPopularGames();
            getSearchInfo();
            return;
        } if (props.location.pathname.includes('/games/allnew')) {
            // reuse search page for new games
            setLocationPathName('/games/allnew/')
            setCustomTitle('New Games');
            fetchNewGames();
            getSearchInfo();
            return;
        } else {
            // BAU Search page
            setLocationPathName('/games/search/')
            setCustomTitle(null);
            if (
                props &&
                props.location &&
                props.location.state &&
                props.location.state.searchTerm
            ) {
                document.getElementById('searchTerm').value =
                    props.location.state.searchTerm;
                search(null, props.location.state.searchTerm, props.match.params.pageNum);
            }
            getSearchInfo();
        }
    }, [props, props.location.pathname]);

    function getAdvancedOptions() {
        return (
            <div
                id="collapseOne"
                className="collapse"
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
            >
                <div className="card-body text-center">
                    <label className="m-1">Genre</label>
                    <select onChange={(e) => setGenre(e.target.value)}>
                        <option value="-1">All</option>
                        {searchInfo.genres &&
                            searchInfo.genres.map((g) => {
                                return <option key={g.id} value={g.id}>{g.name}</option>;
                            })}
                    </select>
                    <label className="m-1">Platform</label>
                    <select onChange={(e) => setPlatform(e.target.value)}>
                        <option value="-1">All</option>
                        {searchInfo.platforms &&
                            searchInfo.platforms.map((p) => {
                                return <option key={p.id} value={p.id}>{p.name}</option>;
                            })}
                    </select>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center">
                <h2>Error</h2>
                <p>
                    500 Error: An error occurred while communicating with the
                    server.
                </p>
            </div>
        );
    } else {
        return (
            <div className={classes.page}>
                <div className="container">
                    <form onSubmit={(e) => {
                        const errorDiv = document.getElementById('errorDiv');
                        errorDiv.innerHTML = '';
                        e.preventDefault();
                        if (validFormInput(e)) {
                            history.push('/games/search/0', {
                                searchTerm: e.target[0].value,
                            });
                        } else {
                            const errorP = document.createElement('p');
                            errorP.className = 'text-danger';
                            errorP.textContent = 'Search term cannot be empty.';
                            errorDiv.append(errorP);
                        }
                    }} className="my-3">
                        <div id="errorDiv" class="text-center"></div>
                        <div className="form-group row">
                            <label
                                forhtml="searchTerm"
                                for="searchTerm"
                                className="col-sm-2 col-form-label text-right"
                            >
                                Search
                            </label>
                            <div className="col-sm-8">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchTerm"
                                    placeholder="Search Term"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`btn col-sm-2 ${classes.buttons}`}
                                style= {{color: 'white', backgroundColor: '#0061c9'}}
                            >
                                Search
                            </button>
                        </div>
                        <div className="accordion text-center">
                            <h1></h1>
                            <h2></h2>
                            <h3></h3>
                            <h4></h4>
                            <h5 className="mb-0">
                                <button
                                    className={`btn ${classes.buttons}`}
                                    type="button"
                                    data-toggle="collapse"
                                    data-target="#collapseOne"
                                    aria-expanded="true"
                                    aria-controls="collapseOne"
                                >
                                    Advanced Search Options
                                </button>
                            </h5>
                        </div>
                        {searchInfo && getAdvancedOptions()}
                    </form>
                </div>
                {customTitle && <p className={classes.customTitle}>{customTitle}</p>}
                {loading && <div className="text-center"><h2>Loading...</h2></div>}
                {!loading && pageData && createGameCards()}
                <br />
                <div className='text-center'>
                    {showPrev && <button className={`btn col-sm-2 ${classes.prevBtn} ${classes.buttons}`} onClick={() => {
                        history.push(`${locationPathName}${parseInt(props.match.params.pageNum) - 1}`, { 
                            searchTerm: props && props.location && props.location.state && props.location.state.searchTerm ? props.location.state.searchTerm  : null  })
                    }}>Previous</button>}
                    {showNext && <button className={`btn btn-primary col-sm-2 ${classes.nextBtn} ${classes.buttons}`} onClick={() => {
                        setPageData(null);
                        history.push(`${locationPathName}${parseInt(props.match.params.pageNum) + 1}`, {
                            searchTerm: props && props.location && props.location.state && props.location.state.searchTerm ? props.location.state.searchTerm  : null  })
                    }}>Next</button>}
                </div>
            </div>
        );
    }
};

export default Search;