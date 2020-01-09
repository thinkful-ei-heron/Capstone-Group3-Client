import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Header from "./components/Header/Header";

import { Login, Logout, Register } from "./components/Account/index";
import ProjectView from "./components/ProjectView/ProjectView";


const App = props => {
  return (
      <FirebaseContext.Provider value={myFirebase}>
        <userContext.Provider value={this.state.user}>
          <BrowserRouter>
            <header>
              <Header user={this.state.user} />
            </header>
            <main className="app__main">
              <Switch>
                <Route exact path="/dashboard" render={() => <Dashboard />} />
                <Route
                  exact
                  path="/login"
                  render={routeProps => (
                    <Login {...routeProps} updateUser={this.updateUser} />
                  )}
                />
                <Route exact path="/register" component={Register} />
                <Route
                  exact
                  path="/logout"
                  render={() => <LogOut updateUser={this.updateUser} />}
                />
              </Switch>
            </main>
          </BrowserRouter>
        </userContext.Provider>
      </FirebaseContext.Provider>
    );
  }
}

export default App;
