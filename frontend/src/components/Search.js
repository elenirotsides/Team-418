import React, { useEffect, useState } from 'react';
import { getUserIdToken } from '../firebase/FirebaseFunctions';
import GameSizableCard from './Home/GameSizableCard';
const Search = (props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [pageData, setPageData] = useState(undefined);
    let idToken;
    const searchUrl = 'http://localhost:5000/games/search';

    async function search(e, redirectedSearchTerm) {
        let searchTerm;
        if(redirectedSearchTerm){
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
            const requestInfo = {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    searchTerm: searchTerm,
                    idToken: idToken,
                }),
            };
            const response = await fetch(searchUrl, requestInfo);
            setPageData(await response.json());
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    }

    function createGameCards() {
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

    useEffect(() => {
        if(props && props.location && props.location.state && props.location.state.searchTerm){
            document.getElementById('searchTerm').value = props.location.state.searchTerm;
            search(null, props.location.state.searchTerm);
        }
    }, [props])

    if (error) {
        return (
            <div>
                <p>
                    500 Error: An error occurred while communicating with the
                    server.
                </p>
            </div>
        );
    } else if (loading) {
        return <p>Loading.....</p>;
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
                    </form>
                </div>
                <div id="errorDiv">{error && <p>{error}</p>}</div>
                {pageData && createGameCards()}
            </div>
        );
    }
};

export default Search;
