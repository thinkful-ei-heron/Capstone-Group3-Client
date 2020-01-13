import React, { useContext, useEffect, useState } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Header/Header';
import Login from './components/Account/Login';

import SignUp from './components/Account/SignUp';
import NewProject from './components/NewProject/NewProject';
import ProjectView from './components/ProjectView/ProjectView';
import LandingPage from './routes/LandingPage/LandingPage';
import PrivateRoute from './services/PrivateRoute';
import { AuthContext } from './services/Auth.js';
import FirebaseContext from './services/context';
import Loading from './components/Loading/Loading';
import './App.css';
// import NewJob from "./components/NewJob/NewJob";
import Firebase from "./services/index";

const App = props => {
  const { currentUser } = useContext(AuthContext);
  const context = useContext(FirebaseContext);
  const [loading, setLoading] = useState(true);
  //console.log(currentUser);

  useEffect(() => {
    const initState = async (email, org) => {
      await context.initState(email, org);

      setLoading(false);
    };

    if (currentUser) {
      if (!context.loaded) initState(currentUser.email, currentUser.displayName);
    }
  }, [currentUser]);

  if (loading) return <Loading />;
  else {
    return (
      <Router>
        <header>
          <Header userName={context.user.name} role={context.user.role} />
        </header>
        <main className="app__main">
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <PrivateRoute exact path="/dashboard" component={() => <Dashboard user={currentUser} />} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={SignUp} />

            <PrivateRoute exact path="/new_project" component={NewProject} />
            {/* <Route
            exact
            path="/new_job"
            render={props => <NewJob {...props} />}
          /> */}
            <PrivateRoute
              exact
              path="/project/:id"
              component={props => <ProjectView id={props.match.params.id} />}
            />
          </Switch>
        </main>
      </Router>
    );
  }
};

export default App;
