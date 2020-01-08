import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import Dashboard from "./components/Dashboard/Dashboard";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import RegisterForm from "./components/Register/Register";

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
          <Route exact path="/register" component={RegisterForm} />
          <Route exact path="/logout" component={Logout} />
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default App;
