import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Header from "./components/Header/Header";
import { Login, Logout, Register } from "./components/Account/index";
import NewProject from "./components/NewProject/NewProject";
import ProjectView from "./components/ProjectView/ProjectView";
import LandingPage from "./routes/LandingPage/LandingPage";
// import NewJob from "./components/NewJob/NewJob";
import Firebase from "./services/index";

const App = props => {
  Firebase.auth().onAuthStateChanged(user => {
    if (user) console.table(`email: ${user.email}`, `org: ${user.displayName}`);
  });
  return (
    <BrowserRouter>
      <header>
        <Header />
      </header>
      <main className="app__main">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/logout" component={Logout} />

          <Route
            exact
            path="/new_project"
            render={props => <NewProject {...props} />}
          />
          {/* <Route
            exact
            path="/new_job"
            render={props => <NewJob {...props} />}
          /> */}
          <Route
            exact
            path="/project/:id"
            component={props => <ProjectView id={props.match.params.id} />}
          />
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default App;
