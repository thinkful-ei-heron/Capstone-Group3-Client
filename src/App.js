import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Header from "./components/Header/Header";
import { Login, Register } from "./components/Account/index";
import { FirebaseContext } from "./services/index";
import myFirebase from "./services/firebase";
import userContext from "./services/userContext";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }
  updateUser = user => {
    this.setState({ user: user });
  };

  componentDidMount() {
    this.getUser();
  }

  getUser = () =>
    myFirebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: {} });
      }
    });

  render() {
    return (
      <FirebaseContext.Provider value={myFirebase}>
        <userContext.Provider value={this.state.user}>
          <BrowserRouter>
            <header>
              <Header user={this.state.user} />
            </header>
            <main className="app__main">
              <Switch>
                <Route exact path="/dashboard" component={Dashboard} />
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
                  render={props =>
                    myFirebase
                      .auth()
                      .signOut()
                      .then(() => {
                        this.updateUser({ user: {} });
                      })
                      .catch(function(error) {
                        throw new Error(error);
                      })
                  }
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
