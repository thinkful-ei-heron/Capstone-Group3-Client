import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { attachCustomCommands } from 'cypress-firebase'

const projectId = Cypress.env('FIREBASE_PROJECT_ID')
const env = Cypress.env('env') || 'stage'

const fbConfig = {
  apiKey: 'AIzaSyDSpoWy8Ewzv50_et07LvZE6InGXw0sfng',
  authDomain: `${projectId}.firebaseapp.com`,
  databaseURL: `https://${projectId}.firebaseio.com`,
  projectId: `${projectId}`,
  storageBucket: `${projectId}.appspot.com`,
}

// Attach authed instance to window (so it can be picked up within the React App)
window.fbInstance = firebase.initializeApp(fbConfig)

// add cy.login, cy.logout, cy.callRtdb, and cy.callFirestore custom commands
attachCustomCommands({ Cypress, cy, firebase })
