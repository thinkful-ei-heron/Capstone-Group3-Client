import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ContextProvider } from './services/context';
import { AuthProvider } from './services/Auth';
import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faAngleRight,
  faAngleDown,
  faPlus,
  faMinus,
  faChevronUp,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';

library.add(faAngleRight, faAngleDown, faPlus, faMinus, faChevronUp, faChevronDown);

ReactDOM.render(
  <AuthProvider>
    <ContextProvider>
      <App />
    </ContextProvider>
  </AuthProvider>,
  document.getElementById('root')
);
