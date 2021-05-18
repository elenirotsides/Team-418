import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Game from './components/GameDetails/Game';
import Profile from './components/Profile';
import NotFound from './components/NotFound';
import { AuthProvider } from './firebase/Auth';
import PrivateRoute from './components/PrivateRoute';
import AppBar from '@material-ui/core/AppBar';
import Search from './components/Search'

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
                    <PrivateRoute exact path="/profile" component={Profile} />
                    <PrivateRoute exact path='/users/:id' component={Profile}/>
                    <PrivateRoute exact path="/game/:id" component={Game} />
                    <PrivateRoute exact path="/games/search/:pageNum" component={Search} />
                    <PrivateRoute exact path="/games/allpopular/:pageNum" component={Search} />
                    <PrivateRoute exact path='/games/allnew/:pageNum' component={Search} /> 
                    <Route path="*" component={NotFound} />
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
