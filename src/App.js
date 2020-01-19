import React, { useContext, useEffect, useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Header/Header';
import Login from './components/Account/Login';
import SignUp from './components/Account/SignUp';
import NewProject from './components/NewProject/NewProject';
import ProjectView from './components/ProjectView/ProjectView';
import LandingPage from './components/LandingPage/LandingPage';
import PrivateRoute from './services/PrivateRoute';
import { AuthContext } from './services/Auth.js';
import Loading from './components/Loading/Loading';
import Logout from './components/Account/Logout';
import './App.css';

const App = props => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const initialPath = () => {
    //console.log('on initPath val is ' + localStorage.getItem('path'));
    if (localStorage.getItem('path')) return localStorage.getItem('path');
    return null;
  };
  const [path, setPath] = useState(initialPath);

  useEffect(() => {
    if (!localStorage.getItem('path') && !path) return;
    localStorage.setItem('path', path);
  }, [path]);

  useEffect(() => {
    if (path) history.push(path);
  }, [currentUser]);

  if (loading) return <Loading />;
  else {
    return (
      <>
        <header>
          <Header userName={'refactoring'} role={'Refactoring'} />
        </header>
        <main className='app__main'>
          <Switch>
            <Route exact path='/' component={LandingPage} />
            <PrivateRoute
              exact
              path='/dashboard'
              location={props.location}
              setPath={setPath}
              component={Dashboard}
            />
            <Route exact path='/login' component={Login} />
            <Route
              exact
              // will use this once I setup a
              // drop down for selecting owner/worker
              path='/(owner|worker)-signup/'
              // path="/register"
              render={() => <SignUp />}
            />
            <Route
              exact
              path='/logout'
              component={() => <Logout setPath={setPath} />}
            />
            <PrivateRoute
              exact
              path='/project/:id'
              location={props.location}
              setPath={setPath}
              component={props => <ProjectView id={props.match.params.id} />}
            />
          </Switch>
        </main>
      </>
    );
  }
};

export default App;
