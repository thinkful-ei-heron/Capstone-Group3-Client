import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <>
      <header className="app__header">
        <h1>Capstone App</h1>
      </header>
      <main className="app__main">
        <Switch>
          <Route exact path={'/'} component={Dashboard} />
        </Switch>
      </main>
    </>
  );
}

export default App;
