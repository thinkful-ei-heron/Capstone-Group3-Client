import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './services/Auth';
import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faAngleRight,
  faAngleDown,
  faPlus,
  faMinus,
  faChevronUp,
  faChevronDown,
  faEdit
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faAngleRight,
  faAngleDown,
  faPlus,
  faMinus,
  faChevronUp,
  faChevronDown,
  faEdit
);

ReactDOM.render(
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>,
  document.getElementById('root')
);
