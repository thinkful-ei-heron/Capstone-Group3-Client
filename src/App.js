import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Header from "./components/Header/Header";
import { Login, Logout, Register } from "./components/Account/index";

const App = props => {
  return (
    <BrowserRouter>
      <header>
        <Header />
      </header>
      <main className="app__main">
        <Switch>
<<<<<<< HEAD
          <Route exact path="/dashboard" component={Dashboard} />
=======


          <Route exact path={"/dashboard"} component={Dashboard} />
          {/* routes go here */}
>>>>>>> 5bf09e948d79de53d4908da63736ea6de7e4517d
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/logout" component={Logout} />

        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default App;
