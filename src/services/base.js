import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const app = firebase.initializeApp({
  // apiKey: 'AIzaSyC6MNMuRCLvGaCRCGbgLI_aybHdYyfY46s',
  // authDomain: 'testing-23849.firebaseapp.com',
  // databaseURL: 'https://testing-23849.firebaseio.com',
  // projectId: 'testing-23849',
  // storageBucket: 'testing-23849.appspot.com',
  // messagingSenderId: '941174175052',
  // appId: '1:941174175052:web:2fcb02525772eb4b3b8be9'

  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
});

export default app;
