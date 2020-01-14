import React from "react";
import app from "./base";

const FirebaseContext = React.createContext({
  user: {
    name: null,
    role: null,
    email: null,
    org: null,
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
  editAndSetJobs: () => {},
  promoteUser: () => {},
});

export default FirebaseContext;

export class ContextProvider extends React.Component {
  state = {
    user: {
      id: "",
      name: "",
      role: "",
      org: "",
    },
    employees: [],
    projects: [],
    project_managers: [],
    jobs: [],
  };

  promoteUser = async (name, org) => {
    return await this.db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .where("name", "==", name)
      .set({
        role: "project manager",
      });
  };

  setStateOnLogout = () => {
    this.setState(
      {
        user: {
          id: "",
          name: "",
          role: "",
          org: "",
        },
        employees: [],
        projects: [],
        project_managers: [],
        jobs: [],
      },
      () => app.auth().signOut(),
    );
  };

  db = app.firestore();

  setloaded = bool => {
    this.setState({ loaded: bool });
  };

  updateAndSetJobs = async (id, status, approval) => {
    let index = this.state.jobs.findIndex(job => job.id === id);
    let newArray = this.state.jobs;
    newArray[index].status = status;
    newArray[index].approval = approval;
    this.setState({
      jobs: newArray,
    });
  };

  editAndSetJobs = async (id, jobObj) => {
    let index = this.state.jobs.findIndex(job => job.id === id);
    let newArray = this.state.jobs;
    newArray[index] = jobObj;
    this.setState({
      jobs: newArray,
    });
  };

  initState = (email, org) => {
    let emps = [],
      projs = [],
      jobs = [],
      pms = [];
    let name = "";
    let role = "";

    this.getUser(email, org)
      .then(snapshot =>
        snapshot.forEach(user => {
          name = user.data().name;
          role = user.data().role;
        }),
      )
      .then(() => this.getProjects(org))
      .then(snapshot => {
        snapshot.forEach(async proj => {
          projs.push(proj.data());
          await this.getJobs(org, proj.id).then(snap =>
            snap.forEach(job => jobs.push(job.data())),
          );
        });
      })
      .then(() => this.getEmployees(org))
      .then(snapshot => snapshot.forEach(emp => emps.push(emp.data())))
      .then(() => this.getProjectManagers(org))
      .then(snapshot => snapshot.forEach(pm => pms.push(pm.data())))
      .then(() => {
        this.setState({
          user: { id: email, name: name, role: role, org: org },
          projects: projs,
          jobs: jobs,
          employees: emps,
          project_managers: pms,
          loaded: true,
        });
      });
  };

  createOwner = async (user, org) => {
    const addOrg = async () => {
      await this.db
        .collection("organizations")
        .doc(org)
        .set({
          name: org,
        });
    };

    addOrg().then(() => {
      this.createUserInOrg(user, org);
    });
  };

  getUser = (email, org) => {
    return this.db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .where("email", "==", email)
      .get();
  };

  getJobs = (org, id) => {
    return this.db
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .doc(id)
      .collection("jobs")
      .get();
  };

  setJobsState = jobs => {
    this.setState({ jobs: jobs });
  };

  getProjects = org => {
    return this.db
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .get();
  };
  setProjectState = projs => {
    this.setState({ projects: projs });
  };

  getEmployees = org => {
    return this.db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .where("role", "==", "project worker")
      .get();
  };

  setEmployeeState = emps => {
    this.setState({ employees: emps });
  };

  getProjectManagers = org => {
    return this.db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .where("role", "==", "project manager")
      .get();
  };

  setProjectManagersState = pms => {
    this.setState({ project_managers: pms });
  };

  createUserInOrg = (newUser, org) => {
    return this.db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .doc(newUser.email)
      .set(newUser);
  };

  getOrgName = org => {
    return this.db
      .collection("organizations")
      .doc(org)
      .get()
      .then(snapshot => {
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
      projects: [...this.state.projects, project],
    });
  };

  setNewJob = async job => {
    this.setState({
      jobs: [...this.state.jobs, job],
    });
  };

  addJob = async (newJob, project_id) => {
    let orgId = this.state.user.org;
    let newId = null;
    let db = this.db;
    await this.db
      .collection(
        `organizations/${this.state.user.org}/projects/${project_id}/jobs`,
      )
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
    this.db.collection("users").add(newUser);
  };

  doGetProject = async (org_id = "HkeHO8n1eIaJSu6mnsd5") => {
    return this.db
      .collection("organizations")
      .doc(org_id)
      .collection("projects")
      .get();
  };

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
        approval: approval,
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
      editAndSetJobs: this.editAndSetJobs,
      promoteUser: this.promoteUser,
    };
    return (
      <FirebaseContext.Provider value={value}>
        {this.props.children}
      </FirebaseContext.Provider>
    );
  }
}
