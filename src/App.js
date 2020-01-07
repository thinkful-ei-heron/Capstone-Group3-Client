import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header/Header'

function App() {
  return (
    <>
      <header>
        <Header />
      </header>
      <main className="app__main">
        <Switch>
          {/* routes go here */}
        </Switch>
      </main>
    </>
  );
}

export default App;
