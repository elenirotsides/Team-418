import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Navigation from './components/Navigation';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Game from './components/Game';
import Results from './components/Results';
import AdvancedSearch from './components/AdvancedSearch';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import { AuthProvider } from './firebase/Auth';
import PrivateRoute from './components/PrivateRoute';
import AppBar from '@material-ui/core/AppBar';
import { Grid } from '@material-ui/core';


function App() {
    return (
        <AuthProvider>
            <Router>
                <AppBar position='sticky'>
                    <div className="App">
                        <header className="App-header">
                            <Navigation/>
                        </header>
                    </div>
                </AppBar>
                <Switch>
                    <PrivateRoute exact path="/" component={Home} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup" component={SignUp} />
                    <PrivateRoute exact path="/profile" component={Profile} />
                    <PrivateRoute exact path="/results/:searchTerm" component={Results} />
                    <PrivateRoute exact path="/advancedsearch" component={AdvancedSearch} />
                    <PrivateRoute exact path="/game/:id" component={Game} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
