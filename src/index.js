import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './services/Auth'
import { library } from '@fortawesome/fontawesome-svg-core'
import './reset.css'

import {
  faAngleRight,
  faAngleDown,
  faPlus,
  faMinus,
  faChevronUp,
  faChevronDown,
  faEdit,
  faTimesCircle,
  faAngleLeft,
  faClipboardList,
  faClipboard,
} from '@fortawesome/free-solid-svg-icons'

import {
  faCalendarCheck,
  faCheckSquare,
  faClock,
} from '@fortawesome/free-regular-svg-icons'

library.add(
  faAngleRight,
  faAngleLeft,
  faAngleDown,
  faPlus,
  faMinus,
  faChevronUp,
  faChevronDown,
  faEdit,
  faTimesCircle,
  faCalendarCheck,
  faCheckSquare,
  faAngleDown,
  faClock,
  faClipboardList
)

ReactDOM.render(
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>,
  document.getElementById('root')
)
