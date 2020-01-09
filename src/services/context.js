import React from "react";
import { db, auth } from "./firebase";

const FirebaseContext = React.createContext({
  user: {
    id: "",
    name: "",
    email: "",
    org: {
      id: "",
      name: "",
    },
  },
  employees: [],
  projects: [],
  jobs: [],
  loading: true,
  setLoading: () => {},
  setUser: () => {},
  getOrgName: () => {},
  setEmployees: () => {},
  setProjects: () => {},
  setJobs: () => {},
  watchAuth: () => {},
  doCreateUserWithEmailAndPassword: () => {},
  doSignInWithEmailAndPassword: () => {},
  doSignOut: () => {},
  doPasswordReset: () => {},
  doPasswordUpdate: () => {},
  doGetProject: () => {},
  doGetProjectJobs: () => {},
});

export default FirebaseContext;

export class ContextProvider extends React.Component {
  state = {
    user: {
      id: "",
      role: "",
      name: "",
      org: {
        id: "",
        name: "",
      },
    },
    employees: [],
    projects: [],
    jobs: [],
  };

  setLoading = bool => {
    this.setState({ loading: bool });
  };

  setUser = (email, org) => {
    return db
      .collection("organizations")
      .where("name", "==", org)
      .get()
      .then(snapshot => {
        let orgId = 0;
        snapshot.forEach(doc => (orgId = doc.id));
        return orgId;
      })
      .then(orgId => {
        db.collection("users")
          .where("email", "==", email)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              console.log("current user:");
              console.log(doc.data());
              this.setState({
                user: {
                  id: doc.id,
                  name: doc.data().name,
                  email: doc.data().email,
                  org: { name: doc.data().org.name, id: orgId },
                  role: doc.data().role,
                },
              });
            });
          })
          .catch(error => console.log(error));
      });
  };

  getOrgName = email => {
    return db
      .collection("users")
      .where("email", "==", email)
      .get()
      .then(snapshot => {
        let orgName = "";
        snapshot.forEach(doc => (orgName = doc.data().org.name));
        return orgName;
      })
      .catch(error => console.log(error));
  };

  setEmployees = org => {
    // console.log(org);
    return db
      .collection("users")
      .where("organization", "==", `${org}`)
      .get()
      .then(snapshot => {
        const employees = [];
        snapshot.forEach(doc => {
          employees.push(doc.data());
        });
        this.setState({
          employees: employees,
        });
      })
      .catch(error => console.log(error));
  };

  setProjects = (role, name) => {
    return db
      .collection(`organizations/HkeHO8n1eIaJSu6mnsd5/projects`)
      .get()
      .then(snapshot => {
        const projects = [];
        if (role === "project worker") {
          snapshot.forEach(doc => {
            if (doc.data().project_workers.includes(name)) {
              projects.push({ id: doc.id, ...doc.data() });
            }
          });
        } else if (role === "project manager") {
          snapshot.forEach(doc => {
            if (doc.data().project_manager === name) {
              const projectObj = {
                id: doc.id,
                date_created: doc.data().date_created,
                deadline: doc.data().deadline,
                description: doc.data().description,
                name: doc.data().name,
                org_id: doc.data().org_id,
                progress: doc.data().progress,
                project_manager: doc.data().project_manager,
                project_workers: doc.data().project_workers,
              };
              projects.push(projectObj);
            }
          });
        } else {
          snapshot.forEach(doc => {
            const projectObj = {
              id: doc.id,
              date_created: doc.data().date_created,
              deadline: doc.data().deadline,
              description: doc.data().description,
              name: doc.data().name,
              org_id: doc.data().org_id,
              progress: doc.data().progress,
              project_manager: doc.data().project_manager,
              project_workers: doc.data().project_workers,
            };
            projects.push(projectObj);
          });
        }
        this.setState({
          projects: projects,
        });
      })
      .then(() => {
        this.setJobs(role, name);
      })
      .catch(error => console.log(error));
  };

  setJobs = (role, name) => {
    // console.log(role, name);
    this.state.projects.forEach(project => {
      // console.log(
      //   `organization/${this.state.user.org.id}/projects/${project.id}/jobs`,
      // );
      db.collection(
        `organizations/${this.state.user.org.id}/projects/${project.id}/jobs`,
      )
        .get()
        .then(snapshot => {
          const jobs = [];
          if (role === "project worker") {
            // console.log("Getting jobs");
            // console.log(snapshot);
            snapshot.forEach(doc => {
              // console.log(doc.data());
              if (doc.data().project_workers.includes(name)) {
                jobs.push({ id: doc.id, ...doc.data() });
              }
            });
          } else if (role === "project manager") {
            snapshot.forEach(doc => {
              if (doc.data().project_manager === name) {
                jobs.push({ id: doc.id, ...doc.data() });
              }
            });
          } else {
            snapshot.forEach(doc => {
              jobs.push({ id: doc.id, ...doc.data() });
            });
          }
          // console.log(jobs);
          // console.log(this.state.jobs);
          this.setState({
            jobs: [...this.state.jobs, jobs],
          });
        })
        .catch(error => console.log(error));
    });
  };

  addProject = newProject => {
    db.collection(`organization/${this.state.user.org.id}/projects`).add(
      newProject,
    );
  };

  addJob = (newJob, project_id) => {
    db.collection(
      `organization/${this.state.user.org.id}/projects/${project_id}/jobs`,
    ).add(newJob);
  };

  addUser = newUser => {
    db.collection("users").add(newUser);
  };

  addProject = newProject => {
    db.collection(`organization/${this.state.user.org.id}/projects`).add(
      newProject,
    );
  };

  addJob = (newJob, project_id) => {
    db.collection(
      `organization/${this.state.user.org.id}/projects/${project_id}/jobs`,
    ).add(newJob);
  };

  addUser = newUser => {
    db.collection("users").add(newUser);
  };

  watchAuth = () => this.auth().onAuthStateChanged(user => user);

  doCreateUserWithEmailAndPassword = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    auth.signInWithEmailAndPassword(email, password);

  doSignOut = () =>
    auth
      .signOut()
      .then(res => this.setState({ user: null }))
      .catch(error => console.log(error));

  doPasswordReset = email => auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => auth.currentUser.updatePassword(password);

  doGetProject = (org_id = "HkeHO8n1eIaJSu6mnsd5") => {
    return db
      .collection("organizations")
      .doc(org_id)
      .collection("projects")
      .get();
  };

  doGetProjectJobs = (
    org_id = "HkeHO8n1eIaJSu6mnsd5",
    project_id = "FUFRX6873V2Llg9XQJBt",
  ) => {
    return db
      .collection("organizations")
      .doc(org_id)
      .collection("projects")
      .doc(project_id)
      .collection("jobs")
      .get();
  };

  render() {
    const value = {
      user: this.state.user,
      employees: this.state.employees,
      projects: this.state.projects,
      jobs: this.state.jobs,
      setUser: this.setUser,
      getOrgName: this.getOrgName,
      setEmployees: this.setEmployees,
      setProjects: this.setProjects,
      setJobs: this.setJobs,
      addProject: this.addProject,
      addJob: this.addJob,
      addUser: this.addUser,
      watchAuth: this.watchAuth,
      doCreateUserWithEmailAndPassword: this.doCreateUserWithEmailAndPassword,
      doSignInWithEmailAndPassword: this.doSignInWithEmailAndPassword,
      doSignOut: this.doSignOut,
      doPasswordReset: this.doPasswordReset,
      doPasswordUpdate: this.doPasswordUpdate,
      doGetProject: this.doGetProject,
      doGetProjectJobs: this.doGetProjectJobs,
      setLoading: this.setLoading,
    };
    return (
      <FirebaseContext.Provider value={value}>
        {this.props.children}
      </FirebaseContext.Provider>
    );
  }
}
