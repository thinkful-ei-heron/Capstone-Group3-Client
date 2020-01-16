import app from './base';

const db = app.firestore();

// setloaded = bool => {
//   this.setState({ loaded: bool });
// };
const dbServices = {
  createOwner(user, org) {
    const addOrg = async () =>
      await db
        .collection('organizations')
        .doc(org)
        .set({
          name: org
        });
    addOrg();
    this.createUserInOrg(user, org);
  },

  getProjectsByRole(user) {
    if (user.role === 'project worker') {
      return db
        .collection('organizations')
        .doc(user.org)
        .collection('projects')
        .where('project_workers', 'array-contains', user.name)
        .get();
    }
    if (user.role === 'project manager') {
      return db
        .collection('organizations')
        .doc(user.org)
        .collection('projects')
        .where('project_manager', '==', user.name)
        .get();
    }
    return db
      .collection('organizations')
      .doc(user.org)
      .collection('projects')
      .get();
  },

  addProject(newProject) {
    console.log(newProject.org_id);
    return db.collection(`organizations/${newProject.org_id}/projects`).add(newProject);
  },

  setProjId(id, orgId) {
    console.log(id, orgId);
    return db
      .collection(`organizations/${orgId}/projects`)
      .doc(`${id}`)
      .update({ id: id });
  },

  getUser(email, org) {
    return db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .where('email', '==', email)
      .get();
  },

  getJobs(org, id) {
    return db
      .collection('organizations')
      .doc(org)
      .collection('projects')
      .doc(id)
      .collection('jobs')
      .get();
  },

  getEmployees(org) {
    return db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .where('role', '==', 'project worker')
      .get();
  },

  getProjectManagers(org) {
    return db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .where('role', '==', 'project manager')
      .get();
  },

  createUserInOrg(newUser, org) {
    return db
      .collection('organizations')
      .doc(org)
      .collection('users')
      .doc(newUser.email)
      .set(newUser);
  },

  getOrgName(org) {
    return db
      .collection('organizations')
      .doc(org)
      .get()
      .then(snapshot => {
        return snapshot.data().name;
      })
      .catch(error => console.log(error));
  },

  async addJob(newJob, project_id) {
    let orgId = this.state.user.org;
    let newId = null;
    let db = db;
    await db
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
  },

  async addUser(newUser) {
    await db.collection('users').add(newUser);
  },

  async doGetProject(org_id = 'HkeHO8n1eIaJSu6mnsd5') {
    return db
      .collection('organizations')
      .doc(org_id)
      .collection('projects')
      .get();
  },

  async updateProjectWorkers(id, workers, project) {
    await db
      .collection('organizations')
      .doc(this.state.user.org)
      .collection('projects')
      .doc(id)
      .update({ project_workers: workers });
    await this.doGetProject(this.state.user.org);
  },

  async updateJobStatus(id, status, project_id, approval) {
    await db
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
  },

  async updateJobApproval(id, project_id) {
    await db
      .collection('organizations')
      .doc(this.state.user.org)
      .collection('projects')
      .doc(project_id)
      .collection('job')
      .doc(id)
      .update({ approval: true, status: 'complete' });
  },

  async editJob(id, jobObj) {
    await db
      .collection('organizations')
      .doc(this.state.user.org)
      .collection('projects')
      .doc(jobObj.project_id)
      .collection('jobs')
      .doc(id)
      .update(jobObj);
  },

  async updateAndSetJobs(id, status, approval) {
    let index = this.state.jobs.findIndex(job => job.id === id);
    let newArray = this.state.jobs;
    newArray[index].status = status;
    newArray[index].approval = approval;
    this.setState({
      jobs: newArray
    });
  },

  async editAndSetJobs(id, jobObj) {
    let index = this.state.jobs.findIndex(job => job.id === id);
    let newArray = this.state.jobs;
    newArray[index] = jobObj;
    this.setState({
      jobs: newArray
    });
  }
};

export default dbServices;

/*

Old set state functions

setProjectState = projs => {
  this.setState({ projects: projs });
};

setJobsState = jobs => {
  this.setState({ jobs: jobs });
};

setEmployeeState = emps => {
  this.setState({ employees: emps });
};

setProjectManagersState = pms => {
  this.setState({ project_managers: pms });
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

*/

// initState = async (email, org) => {
//   let emps = [],
//     projs = [],
//     jobs = [],
//     pms = [];
//   let name = "";
//   let role = "";

//   const user = await this.getUser(email, org);
//   const projects = await this.getProjects(org);
//   const employees = await this.getEmployees(org);
//   const projManagers = await this.getProjectManagers(org);

//   user.forEach(user => {
//     name = user.data().name;
//     role = user.data().role;
//   });
//   projects.forEach(proj => {
//     projs.push(proj.data());
//   });
//   employees.forEach(emp => emps.push(emp.data()));
//   projManagers.forEach(pm => pms.push(pm.data()));

//   for (const proj of projs) {
//     const jobsSnap = await this.getJobs(org, proj.id);
//     jobsSnap.forEach(job => {
//       return jobs.push(job.data());
//     });
//   }

//   this.setState({
//     user: { id: email, name: name, role: role, org: org },
//     projects: projs,
//     jobs: jobs,
//     employees: emps,
//     project_managers: pms,
//     loaded: true
//   });
// };
