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
  setStateOnLogout: () => {},
  updateJobStatus: () => {},
  updateAndSetJobs: () => {},
  updateJobApproval: () => {},
  createOwner: () => {}
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
    jobs: [],
    loaded: false
  };

  setStateOnLogout = () => {
    this.setState(
      {
        user: {
          id: '',
          name: '',
          role: '',
          org: ''
        },
        employees: [],
        projects: [],
        project_managers: [],
        jobs: [],
        loaded: false
      },
      () => app.auth().signOut()
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
      jobs: newArray
    });
  };

  initState = async (email, org) => {
    let emps = [],
      projs = [],
      jobs = [],
      pms = [];
    let name = '';
    let role = '';

    const user = await this.getUser(email, org);
    const projects = await this.getProjects(org);
    const employees = await this.getEmployees(org);
    const projManagers = await this.getProjectManagers(org);

    user.forEach(user => {
      name = user.data().name;
      role = user.data().role;
    });
    projects.forEach(proj => {
      projs.push(proj.data());
    });
    employees.forEach(emp => emps.push(emp.data()));
    projManagers.forEach(pm => pms.push(pm.data()));

    for (const proj of projs) {
      const jobsSnap = await this.getJobs(org, proj.id);
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

  createOwner = async (user, org) => {
    const addOrg = async () =>
      await this.db
        .collection('organizations')
        .doc(org)
        .set({
          name: org
        });
    addOrg();
    this.createUserInOrg(user, org);
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
    return this.db
      .collection('organizations')
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
    await this.doGetProject(this.state.user.org);
  };

  updateJobStatus = async (id, status, project_id, approval) => {
    await this.db
      .collection('organizations')
      .doc(this.state.user.org)
      .collection('projects')
      .doc(project_id)
      .collection('jobs')
      .doc(id)
      .update({
        status: status,
        approval: approval
      });
  };

  updateJobApproval = async (id, project_id) => {
    await this.db
      .collection('organizations')
      .doc(this.state.user.org)
      .collection('projects')
      .doc(project_id)
      .collection('job')
      .doc(id)
      .update({ approval: true, status: 'complete' });
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
      setStateOnLogout: this.setStateOnLogout,
      updateJobStatus: this.updateJobStatus,
      updateAndSetJobs: this.updateAndSetJobs,
      updateJobApproval: this.updateJobApproval,
      createOwner: this.createOwner
    };
    return <FirebaseContext.Provider value={value}>{this.props.children}</FirebaseContext.Provider>;
  }
}
