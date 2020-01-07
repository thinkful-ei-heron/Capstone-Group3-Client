<<<<<<< HEAD
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
=======
import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./components/Header/Header";
// import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
>>>>>>> e0eb17d7bb4b74edfb1bb9e85ac1efebc51164b6

function App() {
  return (
    <>
      <header>
        <Header />
      </header>
      <main className="app__main">
        <Switch>
<<<<<<< HEAD
          <Route exact path={'/'} component={Dashboard} />
=======
          {/* routes go here */}
          {/* <Route exact path="/login" component={Login} /> */}
          <Route exact path="/register" component={Register} />
          {/* <Route exact path="/logout" render={() => firebase.logout}/> */}
>>>>>>> e0eb17d7bb4b74edfb1bb9e85ac1efebc51164b6
        </Switch>
      </main>
    </>
  );
}

export default App;
