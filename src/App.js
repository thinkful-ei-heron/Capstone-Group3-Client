import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import Dashboard from "./Components/Dashboard/Dashboard";
import Header from "./Components/Header/Header";
import { Login, Logout, Register } from "./Components/Account/index";
import ProjectView from "./Components/ProjectView/ProjectView";

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
