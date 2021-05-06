import React, { useEffect, useState } from 'react';
import { getUserIdToken } from '../firebase/FirebaseFunctions';
import GameSizableCard from './Home/GameSizableCard';
const Search = (props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [pageData, setPageData] = useState(undefined);
    const [searchInfo, setSearchInfo] = useState(undefined);
    const [genre, setGenre] = useState(undefined);
    const [platform, setPlatform] = useState(undefined);
    let idToken;
    const searchUrl = 'http://localhost:5000/games/search';
    const searchInfoUrl = 'http://localhost:5000/games/search/info';

    async function search(e, redirectedSearchTerm) {
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
            setPageData(await response.json());
        } catch (err) {
            console.log('search error', err);
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
            console.log('setting error', err);
            setError(true);
        }
        setLoading(false);
    }

    function createGameCards() {
        if (pageData && pageData.length === 0) {
            return (
                <div class="text-center">
                    <h2>No Games Found.</h2>
                </div>
            );
        } else {
            return (
                <div class="ml-3 mr-2">
                    {pageData &&
                        pageData.map((game) => {
                            return (
                                <GameSizableCard
                                    data={game}
                                    cardWidth={'24%'}
                                    cardPaddingTop={'24%'}
                                    cardMarginRight={'1%'}
                                />
                            );
                        })}
                </div>
            );
        }
    }

    useEffect(() => {
        if (
            props &&
            props.location &&
            props.location.state &&
            props.location.state.searchTerm
        ) {
            document.getElementById('searchTerm').value =
                props.location.state.searchTerm;
            search(null, props.location.state.searchTerm);
        }
        getSearchInfo();
    }, [props]);

    function getAdvancedOptions() {
        return (
            <div
                id="collapseOne"
                class="collapse"
                aria-labelledby="headingOne"
                data-parent="#accordionExample"
            >
                <div class="card-body">
                    <label class="m-1">Genre</label>
                    <select onChange={(e) => setGenre(e.target.value)}>
                        <option value="-1">All</option>
                        {searchInfo.genres &&
                            searchInfo.genres.map((g) => {
                                return <option value={g.id}>{g.name}</option>;
                            })}
                    </select>
                    <label class="m-1">Platform</label>
                    <select onChange={(e) => setPlatform(e.target.value)}>
                        <option value="-1">All</option>
                        {searchInfo.platforms &&
                            searchInfo.platforms.map((p) => {
                                return <option value={p.id}>{p.name}</option>;
                            })}
                    </select>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div class="text-center">
                <h2>Error</h2>
                <p>
                    500 Error: An error occurred while communicating with the
                    server.
                </p>
            </div>
        );
    } else {
        return (
            <div>
                <div class="container">
                    <form onSubmit={search} class="my-3">
                        <div class="form-group row">
                            <label
                                for="searchTerm"
                                class="col-sm-2 col-form-label text-right"
                            >
                                Search
                            </label>
                            <div class="col-sm-8">
                                <input
                                    type="text"
                                    class="form-control"
                                    id="searchTerm"
                                    placeholder="Search Term"
                                />
                            </div>
                            <button
                                type="submit"
                                class="btn btn-primary col-sm-2"
                            >
                                Search
                            </button>
                        </div>
                        <div class="accordion" id="accordionExample">
                            <h5 class="mb-0">
                                <button
                                    class="btn"
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
                <div id="errorDiv" class="text-center">{error && <p>{error}</p>}</div>
                {loading && <div class="text-center"><h2>Loading...</h2></div>}
                {!loading && pageData && createGameCards()}
            </div>
        );
    }
};

export default Search;
