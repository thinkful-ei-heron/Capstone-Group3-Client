import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./components/Header/Header";
// import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

function App() {
  return (
    <>
      <header>
        <Header />
      </header>
      <main className="app__main">
        <Switch>
          {/* routes go here */}
          {/* <Route exact path="/login" component={Login} /> */}
          {/* <Route exact path="/register" component={Register} /> */}
          {/* <Route exact path="/logout" render={() => firebase.logout}/> */}
        </Switch>
      </main>
    </>
  );
}

export default App;
