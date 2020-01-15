import React from "react";
import app from "./base";

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
  getOrgName: () => {},
  getProjectManagers: () => {},
  setProjectManagersState: () => {},
  setNewJob: () => {},
  setNewProject: () => {},
  updateProjectWorkers: () => {},
  setStateOnLogout: () => {},
  updateJobStatus: () => {},
  updateAndSetJobs: () => {},
  updateJobApproval: () => {},
  createOwner: () => {},
  editJob: () => {},
  editAndSetJobs: () => {}
});

export default FirebaseContext;

export class ContextProvider extends React.Component {
  // state = {
  //   user: {
  //     id: "",
  //     name: "",
  //     role: "",
  //     org: ""
  //   },
  //   employees: [],
  //   projects: [],
  //   project_managers: [],
  //   jobs: [],
  //   loaded: false
  // };
  state = {
    user: {
      id: "",
      name: "",
      role: "",
      org: ""
    },
    loaded: false
  };

  db = app.firestore();

  getUser = async (email, org) => {
    return await this.db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .where("email", "==", email)
      .get();
  };

  setUser = async (email, org) => {
    let user = await this.getUser(email, org)
    this.setState({
      user: {
        id: email,
        name: user.data().name,
        role: user.data().role,
        org: org
      },
      loaded: true
    })
  }
  
  getAllUserProjects = async () => {
    if (this.state.user.role === "project worker") {
      return await this.db
        .collection("organizations")
        .doc(this.state.user.org)
        .collection("projects")
        .where("project_workers", "array-contains", this.state.user.name)
        .get();
    }
    if (this.state.user.role === "project manager") {
      return await this.db
        .collection("organizations")
        .doc(this.state.user.org)
        .collection("projects")
        .where("project_manager", "==", this.state.user.name)
        .get();
    } else {
      return await this.db
        .collection("organizations")
        .doc(this.state.user.org)
        .collection("projects")
        .get();
    }
  };

  getOneProject = async id => {
    return await this.db
      .collection("organizations")
      .doc(this.state.user.org)
      .collection("projects")
      .where("project_id", "==", id)
      .get();
  };

  getAllUserJobs = async id => {
    if (this.state.user.role === "project worker") {
      return await this.db
        .collection("organizations")
        .doc(this.state.user.org)
        .collection("projects")
        .doc(id)
        .collection("jobs")
        .where("project_workers", "array-contains", this.state.user.name)
        .get();
    }
    if (this.state.user.role === "project manager") {
      return await this.db
        .collection("organizations")
        .doc(this.state.user.org)
        .collection("projects")
        .doc(id)
        .collection("jobs")
        .where("project_manager", "==", this.state.user.name)
        .get();
    } else {
      return await this.db
        .collection("organizations")
        .doc(this.state.user.org)
        .collection("projects")
        .doc(id)
        .collection("jobs")
        .get();
    }
  };

  getOneJob = async (project_id, job_id) => {
    return await this.db
      .collection("organizations")
      .doc(this.state.user.org)
      .collection("projects")
      .doc(project_id)
      .collection("jobs")
      .doc(job_id)
      .get();
  };

  getEmployees = async org => {
    return await this.db
      .collection('organizations')
      .doc(this.state.user.org)
      .collections('users')
      .get()
  };

  addProject = async newProject => {
    let orgId = this.state.user.org;
    await this.db
      .collection(`organizations/${orgId}/projects`)
      .add(newProject)
      .then(function(docRef) {
        db.collection(`organizations/${orgId}/projects`)
          .doc(`${docRef.id}`)
          .update({ id: docRef.id });
      });
  };

  addJob = async newJob => {
    let orgId = this.state.user.org;
    await this.db
      .collection(`organizations/${orgId}/projects`)
      .add(newJob)
      .then(function(docRef) {
        db.collection(`organizations/${orgId}/projects`)
          .doc(`${docRef.id}`)
          .update({ id: docRef.id });
      });
  };

  setStateOnLogout = () => {
    this.setState(
      {
        user: {
          id: "",
          name: "",
          role: "",
          org: ""
        },
      },
      () => app.auth().signOut()
    );
  };

  createOwner = async (user, org) => {
    const addOrg = async () =>
      await this.db
        .collection("organizations")
        .doc(org)
        .set({
          name: org
        });
    addOrg();
    this.createUserInOrg(user, org);
  };

  createUserInOrg = async (newUser, org) => {
    return await this.db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .doc(newUser.email)
      .set(newUser);
  };

  // // setloaded = bool => {
  // //   this.setState({ loaded: bool });
  // // };

  // updateAndSetJobs = async (id, status, approval) => {
  //   let index = this.state.jobs.findIndex(job => job.id === id);
  //   let newArray = this.state.jobs;
  //   newArray[index].status = status;
  //   newArray[index].approval = approval;
  //   this.setState({
  //     jobs: newArray
  //   });
  // };

  // editAndSetJobs = async (id, jobObj) => {
  //   let index = this.state.jobs.findIndex(job => job.id === id);
  //   let newArray = this.state.jobs;
  //   newArray[index] = jobObj;
  //   this.setState({
  //     jobs: newArray
  //   });
  // };

  initState = async (email, org) => {
    let emps = [],
      projs = [],
      jobs = [],
      pms = [];
    let name = "";
    let role = "";

    const user = await this.getUser(email, org);
    const employees = await this.getEmployees(org);
    const projManagers = await this.getProjectManagers(org);

    user.forEach(user => {
      name = user.data().name;
      role = user.data().role;
    });
    const projects = await this.getProjects(org, role, name);
    projects.forEach(proj => {
      projs.push(proj.data());
    });
    employees.forEach(emp => emps.push(emp.data()));
    projManagers.forEach(pm => pms.push(pm.data()));

    for (const proj of projs) {
      const jobsSnap = await this.getJobs(org, proj.id, role, name);
      jobsSnap.forEach(job => {
        return jobs.push(job.data());
      });
    }

    this.setState({
      user: { id: email, name: name, role: role, org: org },
      projects: projs,
      jobs: jobs,
      employees: emps,
      project_managers: pms,
      loaded: true
    });
  };



  

  // getJobs = (org, id, role, name) => {
  //   if (role === 'project worker') {
  //     return this.db
  //     .collection("organizations")
  //     .doc(org)
  //     .collection("projects")
  //     .doc(id)
  //     .collection("jobs")
  //     .where('project_workers', 'array-contains', name)
  //     .get();
  //   } else {
  //     return this.db
  //     .collection("organizations")
  //     .doc(org)
  //     .collection("projects")
  //     .doc(id)
  //     .collection("jobs")
  //     .get();
  //   }
  // };

  // // setJobsState = jobs => {
  // //   this.setState({ jobs: jobs });
  // // };

  // getProjects = (org, role, name) => {
  //   if (role === "project worker") {
  //     return this.db
  //       .collection("organizations")
  //       .doc(org)
  //       .collection("projects")
  //       .where('project_workers', 'array-contains', name)
  //       .get();
  //   }
  //   if (role === 'project manager') {
  //     return this.db
  //       .collection("organizations")
  //       .doc(org)
  //       .collection("projects")
  //       .where('project_manager', '==', name)
  //       .get();
  //   } else {
  //     return this.db
  //     .collection("organizations")
  //     .doc(org)
  //     .collection("projects")
  //     .get();
  //   }
  // };

  // // setProjectState = projs => {
  // //   this.setState({ projects: projs });
  // // };

 

  // // setEmployeeState = emps => {
  // //   this.setState({ employees: emps });
  // // };

  // getProjectManagers = org => {
  //   return this.db
  //     .collection("organizations")
  //     .doc(org)
  //     .collection("users")
  //     .where("role", "==", "project manager")
  //     .get();
  // };

  // // setProjectManagersState = pms => {
  // //   this.setState({ project_managers: pms });
  // // };

 

  // // getOrgName = org => {
  // //   return this.db
  // //     .collection("organizations")
  // //     .doc(org)
  // //     .get()
  // //     .then(snapshot => {
  // //       return snapshot.data().name;
  // //     })
  // //     .catch(error => console.log(error));
  // // };

  

  // setNewProject = project => {
  //   this.setState({
  //     projects: [...this.state.projects, project]
  //   });
  // };

  // setNewJob = async job => {
  //   this.setState({
  //     jobs: [...this.state.jobs, job]
  //   });
  // };

  // addJob = async (newJob, project_id) => {
  //   let orgId = this.state.user.org;
  //   let newId = null;
  //   let db = this.db;
  //   await this.db
  //     .collection(
  //       `organizations/${this.state.user.org}/projects/${project_id}/jobs`
  //     )
  //     .add(newJob)
  //     .then(function(docRef) {
  //       db.collection(`organizations/${orgId}/projects/${project_id}/jobs`)
  //         .doc(`${docRef.id}`)
  //         .update({ id: docRef.id });
  //       newId = docRef.id;
  //     });
  //   newJob.id = newId;
  //   this.setNewJob(newJob);
  // };

  // addUser = newUser => {
  //   this.db.collection("users").add(newUser);
  // };

  // doGetProject = async (org_id = "HkeHO8n1eIaJSu6mnsd5") => {
  //   return this.db
  //     .collection("organizations")
  //     .doc(org_id)
  //     .collection("projects")
  //     .get();
  // };

  updateProjectWorkers = async (id, workers, project) => {
    await this.db
      .collection("organizations")
      .doc(this.state.user.org)
      .collection("projects")
      .doc(id)
      .update({ project_workers: workers });
    await this.doGetProject(this.state.user.org);
  };

  updateJobStatus = async (id, status, project_id, approval) => {
    await this.db
      .collection("organizations")
      .doc(this.state.user.org)
      .collection("projects")
      .doc(project_id)
      .collection("jobs")
      .doc(id)
      .update({
        status: status,
        approval: approval
      });
  };

  updateJobApproval = async (id, project_id) => {
    await this.db
      .collection("organizations")
      .doc(this.state.user.org)
      .collection("projects")
      .doc(project_id)
      .collection("job")
      .doc(id)
      .update({ approval: true, status: "complete" });
  };

  editJob = async (id, jobObj) => {
    await this.db
      .collection("organizations")
      .doc(this.state.user.org)
      .collection("projects")
      .doc(jobObj.project_id)
      .collection("jobs")
      .doc(id)
      .update(jobObj);
  };

  render() {
    const value = {
      user: this.state.user,
      employees: this.state.employees,
      projects: this.state.projects,
      project_managers: this.state.project_managers,
      jobs: this.state.jobs,
      loaded: this.state.loaded,
      initState: this.initState,
      getOrgName: this.getOrgName,
      addProject: this.addProject,
      addJob: this.addJob,
      addUser: this.addUser,
      setNewJob: this.setNewJob,
      setloaded: this.setloaded,
      createUserInOrg: this.createUserInOrg,
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
      setStateOnLogout: this.setStateOnLogout,
      updateJobStatus: this.updateJobStatus,
      updateAndSetJobs: this.updateAndSetJobs,
      updateJobApproval: this.updateJobApproval,
      createOwner: this.createOwner,
      editJob: this.editJob,
      editAndSetJobs: this.editAndSetJobs
    };
    return (
      <FirebaseContext.Provider value={value}>
        {this.props.children}
      </FirebaseContext.Provider>
    );
  }
}
