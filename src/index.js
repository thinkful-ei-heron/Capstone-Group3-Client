import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ContextProvider } from './services/context';
import { AuthProvider } from './services/Auth';

ReactDOM.render(
  <AuthProvider>
    <ContextProvider>
      <App />
    </ContextProvider>
  </AuthProvider>,
  document.getElementById('root')
);
