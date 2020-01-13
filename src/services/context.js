import React from 'react';
import app from './base';

const FirebaseContext = React.createContext({
  user: {
    name: null,
    role: null,
    email: null,
    org: null
  },
  employees: [],
  projects: [],
  project_managers: [],
  jobs: [],
  loaded: false,
  initState: () => {},
  setloaded: () => {},
  getJobs: () => {},
  setJobsState: () => {},
  getProjects: () => {},
  setProjectState: () => {},
  addProject: () => {},
  getEmployees: () => {},
  setEmployeeState: () => {},
  createUserInorg: () => {},
  newSetUser: () => {},
  getOrgName: () => {},
  getProjectManagers: () => {},
  setProjectManagersState: () => {},
  setNewJob: () => {},
  setNewProject: () => {},
  updateProjectWorkers: () => {},
  setStateOnLogout: () => {}

  // DEPRECATED
  // setUser: () => {},
  // setProjects: () => {},
  // setJobs: () => {},
  // doGetProject: () => {},
  // doGetProjectJobs: () => {},
});

export default FirebaseContext;

export class ContextProvider extends React.Component {
  state = {
    user: {
      id: '',
      name: '',
      role: '',
      org: ''
    },
    employees: [],
    projects: [],
    project_managers: [],
    jobs: []
  };

  setStateOnLogout = () => {
    this.setState({
      user: {
        id: '',
        name: '',
        role: '',
        org: ''
      },
      employees: [],
      projects: [],
      project_managers: [],
      jobs: []
    })
  }

  db = app.firestore();

  setloaded = bool => {
    this.setState({ loaded: bool });
  };

  initState = (email, org) => {
    let emps = [],
      projs = [],
      jobs = [],
      pms = [];
    let name = '';
    let role = '';

    this.getUser(email, org)
      .then(snapshot =>
        snapshot.forEach(user => {
          name = user.data().name;
          role = user.data().role;
        })
      )
      .then(() => this.getProjects('orgOne'))
      .then(snapshot => {
        snapshot.forEach(async proj => {
          projs.push(proj.data());
          await this.getJobs('orgOne', proj.id).then(snap => snap.forEach(job => jobs.push(job.data())));
        });
      })
      .then(() => this.getEmployees('orgOne'))
      .then(snapshot => snapshot.forEach(emp => emps.push(emp.data())))
      .then(() => this.getProjectManagers('orgOne'))
      .then(snapshot => snapshot.forEach(pm => pms.push(pm.data())))
      .then(() => {
        this.setState({
          user: { id: email, name: name, role: role, org: org },
          projects: projs,
          jobs: jobs,
          employees: emps,
          project_managers: pms,
          loaded: true
        });
      });
  };

  getUser = (email, org) => {
    return this.db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .where('email', '==', email)
      .get();
  };

  getJobs = (org, id) => {
    //console.log(org, id);
    return this.db
      .collection('organizations')
      .doc(org)
      .collection('projects')
      .doc(id)
      .collection('jobs')
      .get();
  };

  setJobsState = jobs => {
    this.setState({ jobs: jobs });
  };

  getProjects = org => {
    return this.db
      .collection('organizations')
      .doc(org)
      .collection('projects')
      .get();
  };
  setProjectState = projs => {
    this.setState({ projects: projs });
  };

  getEmployees = org => {
    return this.db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .where('role', '==', 'project worker')
      .get();
  };

  setEmployeeState = emps => {
    this.setState({ employees: emps });
  };

  getProjectManagers = org => {
    return this.db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .where('role', '==', 'project manager')
      .get();
  };

  setProjectManagersState = pms => {
    this.setState({ project_managers: pms });
  };

  createUserInOrg = (newUser, org) => {
    return this.db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .doc(newUser.email)
      .set(newUser);
  };

  newSetUser = (email, org) => {
    this.db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .doc(email)
      .onSnapshot(snapshot => {
        this.setState({
          user: {
            email: snapshot.data().email,
            name: snapshot.data().name,
            role: snapshot.data().role,
            org: org
          }
        });
      });
  };

  getOrgName = org => {
    // console.log(org);
    return this.db
      .collection('organizations')
      .doc(org)
      .get()
      .then(snapshot => {
        // console.log(snapshot.data());
        return snapshot.data().name;
      })
      .catch(error => console.log(error));
  };

  addProject = async newProject => {
    let orgId = this.state.user.org;
    let newId = null;
    let db = this.db;
    await this.db
      .collection(`organizations/${orgId}/projects`)
      .add(newProject)
      .then(function(docRef) {
        db.collection(`organizations/${orgId}/projects`)
          .doc(`${docRef.id}`)
          .update({ id: docRef.id });
        newId = docRef.id;
      });
    newProject.id = newId;
    this.setNewProject(newProject);
  };

  setNewProject = project => {
    this.setState({
      projects: [...this.state.projects, project]
    });
  };

  setNewJob = async job => {
    this.setState({
      jobs: [...this.state.jobs, job]
    });
  };

  addJob = async (newJob, project_id) => {
    let orgId = this.state.user.org;
    let newId = null;
    let db = this.db;
    await this.db
      .collection(`organizations/${this.state.user.org}/projects/${project_id}/jobs`)
      .add(newJob)
      .then(function(docRef) {
        db.collection(`organizations/${orgId}/projects/${project_id}/jobs`)
          .doc(`${docRef.id}`)
          .update({ id: docRef.id });
        newId = docRef.id;
      });
    newJob.id = newId;
    this.setNewJob(newJob);
  };

  addUser = newUser => {
    this.db.collection('users').add(newUser);
  };

  doGetProject = async (org_id = 'HkeHO8n1eIaJSu6mnsd5') => {
    return this.db
      .collection('organizations')
      .doc(org_id)
      .collection('projects')
      .get();
  };

  updateProjectWorkers = async (id, workers, project) => {
    await this.db
      .collection('organizations')
      .doc(this.state.user.org)
      .collection('projects')
      .doc(id)
      .update({ project_workers: workers });
    await this.doGetProject('orgOne');
  };

  // DEPRECATED
  // setUser = (email, org) => {
  //   return this.db
  //     .collection("organizations")
  //     .where("name", "==", org)
  //     .get()
  //     .then(snapshot => {
  //       let orgId = 0;
  //       snapshot.forEach(doc => (orgId = doc.id));
  //       return orgId;
  //     })
  //     .then(orgId => {
  //       this.db.collection("users")
  //         .where("email", "==", email)
  //         .get()
  //         .then(snapshot => {
  //           snapshot.forEach(doc => {
  //             console.log("current user:");
  //             console.log(doc.data());
  //             this.setState({
  //               user: {
  //                 id: doc.id,
  //                 name: doc.data().name,
  //                 email: doc.data().email,
  //                 org: { name: doc.data().org.name, id: orgId },
  //                 role: doc.data().role,
  //               },
  //             });
  //           });
  //         })
  //         .catch(error => console.log(error));
  //     });
  // };

  // DEPRECATED
  // setProjects = (role, name) => {
  //   return this.db
  //     .collection(`organizations/${this.state.user.org.id}/projects`)
  //     .get()
  //     .then(snapshot => {
  //       const projects = [];
  //       if (role === "project worker") {
  //         snapshot.forEach(doc => {
  //           if (doc.data().project_workers.includes(name)) {
  //             projects.push({ id: doc.id, ...doc.data() });
  //           }
  //         });
  //       } else if (role === "project manager") {
  //         snapshot.forEach(doc => {
  //           if (doc.data().project_manager === name) {
  //             const projectObj = {
  //               id: doc.id,
  //               date_created: doc.data().date_created,
  //               deadline: doc.data().deadline,
  //               description: doc.data().description,
  //               name: doc.data().name,
  //               org_id: doc.data().org_id,
  //               progress: doc.data().progress,
  //               project_manager: doc.data().project_manager,
  //               project_workers: doc.data().project_workers,
  //             };
  //             projects.push(projectObj);
  //           }
  //         });
  //       } else {
  //         snapshot.forEach(doc => {
  //           const projectObj = {
  //             id: doc.id,
  //             date_created: doc.data().date_created,
  //             deadline: doc.data().deadline,
  //             description: doc.data().description,
  //             name: doc.data().name,
  //             org_id: doc.data().org_id,
  //             progress: doc.data().progress,
  //             project_manager: doc.data().project_manager,
  //             project_workers: doc.data().project_workers,
  //           };
  //           projects.push(projectObj);
  //         });
  //       }
  //       this.setState({
  //         projects: projects,
  //       });
  //     })
  //     .then(() => {
  //       this.setJobs(role, name);
  //     })
  //     .catch(error => console.log(error));
  // };

  // DEPRECATED
  // setJobs = (role, name) => {
  //   // console.log(role, name);
  //   this.state.projects.forEach(project => {
  //     // console.log(
  //     //   `organization/${this.state.user.org.id}/projects/${project.id}/jobs`,
  //     // );
  //     this.db.collection(
  //       `organizations/${this.state.user.org.id}/projects/${project.id}/jobs`,
  //     )
  //       .get()
  //       .then(snapshot => {
  //         const jobs = [];
  //         if (role === "project worker") {
  //           // console.log("Getting jobs");
  //           // console.log(snapshot);
  //           snapshot.forEach(doc => {
  //             console.log(doc.data());
  //             if (doc.data().project_workers.includes(name)) {
  //               jobs.push({ id: doc.id, ...doc.data() });
  //             }
  //           });
  //         } else if (role === "project manager") {
  //           snapshot.forEach(doc => {
  //             console.log(doc.data());
  //             if (doc.data().project_manager === name) {
  //               jobs.push({ id: doc.id, ...doc.data() });
  //             }
  //           });
  //         } else {
  //           snapshot.forEach(doc => {
  //             jobs.push({ id: doc.id, ...doc.data() });
  //           });
  //         }

  //         console.log(jobs);
  //         console.log(this.state.jobs);

  //         this.setState({
  //           jobs: [...this.state.jobs, jobs],
  //         });
  //       })
  //       .catch(error => console.log(error));
  //   });
  // };

  // addJob = (newJob, project_id) => {
  //   console.log('adding job!')
  //   this.db.collection(
  //     `organizations/${this.state.user.org.id}/projects/${project_id}/jobs`,
  //   ).add(newJob).then(doc => {
  //     console.log(doc)
  //   })
  // };

  // DEPRECATED
  // doGetProjectJobs = (
  //   org_id = "HkeHO8n1eIaJSu6mnsd5",
  //   project_id = "FUFRX6873V2Llg9XQJBt",
  // ) => {
  //   return this.db
  //     .collection("organizations")
  //     .doc(org_id)
  //     .collection("projects")
  //     .doc(project_id)
  //     .collection("jobs")
  //     .get();
  // };

  render() {
    const value = {
      user: this.state.user,
      employees: this.state.employees,
      projects: this.state.projects,
      project_managers: this.state.project_managers,
      jobs: this.state.jobs,
      initState: this.initState,
      getOrgName: this.getOrgName,
      addProject: this.addProject,
      addJob: this.addJob,
      addUser: this.addUser,
      setNewJob: this.setNewJob,
      setloaded: this.setloaded,
      createUserInOrg: this.createUserInOrg,
      newSetUser: this.newSetUser,
      getProjects: this.getProjects,
      getEmployees: this.getEmployees,
      setEmployeeState: this.setEmployeeState,
      setProjectState: this.setProjectState,
      getJobs: this.getJobs,
      setJobsState: this.setJobsState,
      getProjectManagers: this.getProjectManagers,
      setProjectManagersState: this.setProjectManagersState,
      setNewProject: this.setNewProject,
      updateProjectWorkers: this.updateProjectWorkers,
      setStateOnLogout: this.setStateOnLogout

      // DEPRECATED
      // setProjects: this.setProjects,
      // setJobs: this.setJobs,
      // doGetProject: this.doGetProject,
      // doGetProjectJobs: this.doGetProjectJobs,
      // setUser: this.setUser,
    };
    return <FirebaseContext.Provider value={value}>{this.props.children}</FirebaseContext.Provider>;
  }
}
