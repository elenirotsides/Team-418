import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Game from './components/Game';
import Results from './components/Results';
import AdvancedSearch from './components/AdvancedSearch';
import Profile from './components/Profile';
import NotFound from './components/NotFound';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Team 418 Final Project</h1>
                    <Link className="showlink" to="/">
                        Home
                    </Link>
                    <Link className="showlink" to="/profile">
                        Profile
                    </Link>
                    <Link className="showlink" to="/advancedsearch">
                        Advanced Search
                    </Link>
                    <Link className="showlink" to="/login">
                        Login
                    </Link>
                    <Link className="showlink" to="/signup">
                        Sign Up
                    </Link>
                    <Link className="showlink" to="/results/test">
                        Results
                    </Link>
                    <Link className="showlink" to="/game/1">
                        Game
                    </Link>
                </header>
                <div className="App-body">
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/signup" component={SignUp} />
                        <Route exact path="/profile" component={Profile} />
                        <Route
                            exact
                            path="/results/:searchTerm"
                            component={Results}
                        />
                        <Route
                            exact
                            path="/advancedsearch"
                            component={AdvancedSearch}
                        />
                        <Route exact path="/game/:gameId" component={Game} />
                        <Route path="*" component={NotFound} />
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
