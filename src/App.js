import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header/Header';
import Jobs from './components/Jobs/Jobs';


function App() {
  return (
    <>
      <header>
        <Header />
      </header>
      <main className="app__main">
        <Jobs />
        <Switch>
          {/* routes go here */}
        </Switch>
      </main>
    </>
  );
}

export default App;
