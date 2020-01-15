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
import FirebaseContext from './services/context';
import Loading from './components/Loading/Loading';
import Logout from './components/Account/Logout';
import './App.css';

const App = props => {
  const { currentUser } = useContext(AuthContext);
  const context = useContext(FirebaseContext);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const initialPath = () => {
    if (localStorage.getItem('path')) return localStorage.getItem('path');
    return null;
  };
  const [path, _setPath] = useState(initialPath);
  const setPath = p => _setPath(p);

  useEffect(() => localStorage.setItem('path', path), [path]);

  useEffect(() => {
    console.log(path);
    const initState = async (email, org) => {
      setLoading(true);
      await context.initState(email, org);

      if (path) {
        //console.log('pushing to path ' + path);
        history.push(path);
      }

      setLoading(false);
    };
    console.log(currentUser);
    if (currentUser && currentUser.displayName) {
      if (!context.loaded) initState(currentUser.email, currentUser.displayName);
    } else if (!path) {
      //console.log('set loading to false');
      setLoading(false);
    }

    console.log(path);
    console.log(loading);
  }, [currentUser]);

  if (loading) return <Loading />;
  else {
    return (
      <>
        <header>
          <Header userName={context.user.name} role={context.user.role} />
        </header>
        <main className="app__main">
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <PrivateRoute
              exact
              path="/dashboard"
              location={props.location}
              setPath={setPath}
              component={Dashboard}
            />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" render={() => <SignUp />} />
            <Route exact path="/logout" component={() => <Logout setPath={setPath} />} />
            <PrivateRoute
              exact
              path="/new_project"
              location={props.location}
              setPath={setPath}
              component={NewProject}
            />
            <PrivateRoute
              exact
              path="/project/:id"
              location={props.location}
              setPath={setPath}
              component={props => <ProjectView id={props.match.params.id} />}
            />

            <Route exact path="/owner-signup" render={() => <SignUp />} />
          </Switch>
        </main>
      </>
    );
  }
};

export default App;
