import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  watchAuth = () => this.auth().onAuthStateChanged(user => user);

  getUsers = () => {
    return this.db.collection("users").get();
  };

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () =>
    this.auth
      .signOut()
      .then(res => res)
      .catch(error => console.log(error));

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
  
  doGetProject = (org_id = 'HkeHO8n1eIaJSu6mnsd5') => {
    return this.db.collection('organizations').doc(org_id).collection('projects').get();
  }

  doGetProjectJobs = (org_id = 'HkeHO8n1eIaJSu6mnsd5', project_id = 'FUFRX6873V2Llg9XQJBt') => {
    return this.db.collection('organizations').doc(org_id).collection('projects').doc(project_id).collection('jobs').get();
  }

  getUsers = () => {
    return this.db.collection('users').get();
  }
}

export default Firebase;
