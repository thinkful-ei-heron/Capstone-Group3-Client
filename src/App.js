import React, { useContext, useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Header from "./components/Header/Header";
import Login from "./components/Account/Login";
import SignUp from "./components/Account/SignUp";
// import NewProject from "./components/NewProject/NewProject";
import ProjectView from "./components/Project/ProjectView/ProjectView";
import LandingPage from "./components/LandingPage/LandingPage";
import PrivateRoute from "./services/PrivateRoute";
import { AuthContext } from "./services/Auth.js";
import Logout from "./components/Account/Logout";
import "./App.css";
// import Sidebar from "./components/Sidebar/Sidebar";

const App = props => {
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();

  const initialPath = () => {
    if (localStorage.getItem("path")) return localStorage.getItem("path");
    return null;
  };
  const [path, setPath] = useState(initialPath);

  useEffect(() => {
    if (!localStorage.getItem("path") && !path) return;
    localStorage.setItem("path", path);
  }, [path]);

  useEffect(() => {
    if (path) history.push(path);
  }, [currentUser]);
  return (
    <>
      <header>
        <Header
          history={history}
          userName={currentUser && currentUser.name}
          role={currentUser && currentUser.role}
        />
      </header>
      <main className="app__main">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" setPath={setPath} component={Login} />
          <Route
            exact
            // drop down instead for selecting owner/worker?
            path="/(owner|worker)-signup/"
            // path="/register"
            render={() => <SignUp />}
          />
          <PrivateRoute
            exact
            path="/dashboard"
            location={props.location}
            setPath={setPath}
            component={Dashboard}
          />
          <PrivateRoute
            exact
            path="/project/:id"
            location={props.location}
            setPath={setPath}
            component={props => <ProjectView id={props.match.params.id} />}
          />
          {/* <PrivateRoute
              exact
              path='/profile/:id'
              location={props.location}
              setPath={setPath}
              id={props.match.params.id}
              component={ProfileView}
            /> */}
          {/* <PrivateRoute
            exact
            path="/logout"
            setPath={setPath}
            component={Logout}
          /> */}
          {/* <Route>
              <h3>Need to implement a catchall route/component here</h3>
            </Route> */}
        </Switch>
        {/* <PrivateRoute path="/" component={() => <Sidebar />} /> */}
      </main>
    </>
  );
};

export default App;
