import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Header from "./components/Header/Header";
import { Login, Logout, Register } from "./components/Account/index";
import ProjectView from "./components/ProjectView/ProjectView";


const App = props => {
  return (
    <BrowserRouter>
      <header>
        <Header />
      </header>
      <main className="app__main">
        <Switch>
          <Route exact path={"/dashboard"} component={Dashboard} />
          {/* routes go here */}
          <Route exact path="/login" component={Login} /> 
          <Route exact path="/register" component={Register} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/project" component={ProjectView} />

        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default App;
