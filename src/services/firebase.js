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
    this.db = app.firestore();
    this.auth = app.auth();
    this.state = {
      user: {
        id: "",
        name: "",
        org: {
          id: "",
          name: ""
        },
        role: ""
      },
      employees: [],
      projects: [],
      jobs: []
    };
  }

  setUser = email => {
    this.db
      .collection("users")
      .where("email", "==", `${email}`)
      .get()
      .then(snapshot => {
        const user = snapshot.forEach(doc => {
          return doc;
        });
        this.setState({
          user: {
            id: user.id,
            name: user.data().name,
            org: {
              name: user.data().organization
            },
            role: user.data().role
          }
        });
      })
      .catch(error => console.log(error));
  };

  setOrgId = org => {
    this.db
      .collection("organizations")
      .where("name", "==", `${org}`)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.setState({
            user: {
              org: {
                id: doc.data().id
              }
            }
          });
        });
      })
      .catch(error => console.log(error));
  };

  setEmployees = org => {
    this.db
      .collection("users")
      .where("organization", "==", `${org}`)
      .get()
      .then(snapshot => {
        const employees = [];
        snapshot.forEach(doc => {
          employees.push(doc.data());
        });
        this.setState({
          employees: employees
        });
      })
      .catch(error => console.log(error));
  };

  setProjects = (role, name, org) => {
    this.db
      .collection(`organizations/${this.state.user.org.id}/projects`)
      .get()
      .then(snapshot => {
        const projects = [];
        if (role === "project worker") {
          snapshot.forEach(doc => {
            if (doc.data().project_workers.includes(name)) {
              projects.push(doc);
            }
          });
        } else if (role === "project manager") {
          snapshot.forEach(doc => {
            if (doc.data().project_manager === name) {
              projects.push(doc);
            }
          });
        } else {
          snapshot.forEach(doc => {
            projects.push(doc);
          });
        }
        this.setState({
          projects: projects
        });
      })
      .catch(error => console.log(error));
  };

  setJobs = (role, name) => {
    this.state.projects.forEach(project => {
      this.db
        .collection(
          `organization/${this.state.user.org.id}/projects/${project.id}/jobs`
        )
        .get()
        .then(snapshot => {
          const jobs = [];
          if (role === "project worker") {
            snapshot.forEach(doc => {
              if (doc.data().project_workers.includes(name)) {
                jobs.push(doc.data());
              }
            });
          } else if (role === "project manager") {
            snapshot.forEach(doc => {
              if (doc.data().project_manager === name) {
                jobs.push(doc.data());
              }
            });
          } else {
            snapshot.forEach(doc => {
              jobs.push(doc.data());
            });
          }
          this.setState({
            jobs: [...this.state.jobs, jobs]
          });
        })
        .catch(error => console.log(error));
    });
  };

  getProjects = () =>
    // this.db.collection('organizations/HkeHO8n1eIaJSu6mnsd5/projects')
    this.db.collection(`organizations/HkeHO8n1eIaJSu6mnsd5/projects`).get();

  getJobs = project_id =>
    this.db
      .collection(
        `organizations/HkeHO8n1eIaJSu6mnsd5/projects/${project_id}/jobs`
      )
      .get();

  watchAuth = () => this.auth().onAuthStateChanged(user => user);

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
