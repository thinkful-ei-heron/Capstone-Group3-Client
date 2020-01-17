import app from './base';

const db = app.firestore();

// setloaded = bool => {
//   this.setState({ loaded: bool });
// };
const dbServices = {
  createOwner(org) {
    const addOrg = async () =>
      await db
        .collection('organizations')
        .doc(org)
        .set({
          name: org
        });
    addOrg();
    return 'success';
  },

  async initDashboard(name, role, org) {
    const projs = [];
    const managers = [];

    // //get user
    // const userSnap = await dbServices.getUser(email, org);

    // userSnap.forEach(user => {
    //   name = user.data().name;
    //   role = user.data().role;
    // });

    //get projects
    const projects = await dbServices.getProjectsByRole({
      name: name,
      org: org,
      role: role
    });

    projects.forEach(proj => projs.push(proj.data()));

    //get projectManagers
    if (role === 'owner') {
      const PMs = await dbServices.getProjectManagers(org);
      PMs.forEach(pm => managers.push(pm.data()));
    }

    return {
      name: name,
      role: role,
      projects: projs,
      project_managers: managers
    };
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

  getProjectById(id, org) {
    return db
      .collection('organizations')
      .doc(org)
      .collection('projects')
      .doc(id)
      .get();
  },

  addProject(newProject) {
    console.log(newProject.org_id);
    if (!newProject.project_manager) newProject.project_manager = 'unassigned';
    return db
      .collection(`organizations/${newProject.org_id}/projects`)
      .add(newProject);
  },

  setProjId(id, orgId) {
    console.log(id, orgId);
    return db
      .collection(`organizations/${orgId}/projects`)
      .doc(`${id}`)
      .update({ id: id });
  },

  updateProject(proj) {
    console.log(proj.id);
    return db
      .collection('organizations')
      .doc(proj.org_id)
      .collection('projects')
      .doc(proj.id)
      .update(proj);
  },

  setProjectsManager(projId, org, pm) {
    return db
      .collection('organizations')
      .doc(org)
      .collection('projects')
      .doc(projId)
      .update({ project_manager: pm });
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
    await db
      .collection(
        `organizations/${newJob.organization}/projects/${project_id}/jobs`
      )
      .add(newJob)
      .then(function(docRef) {
        db.collection(
          `organizations/${newJob.organization}/projects/${project_id}/jobs`
        )
          .doc(`${docRef.id}`)
          .update({ id: docRef.id });
      });
  },

  async updateEdit(edit, id, project_id, org) {
    await db
      .collection('organizations')
      .doc(org)
      .collection('projects')
      .doc(project_id)
      .collection('jobs')
      .doc(id)
      .update({ edit: edit });
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

  async updateProjectWorkers(id, workers, org) {
    await db
      .collection('organizations')
      .doc(org)
      .collection('projects')
      .doc(id)
      .update({ project_workers: workers });
  },

  async updateJobStatus(id, status, project_id, approval, org) {
    await db
      .collection('organizations')
      .doc(org)
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
      .doc(jobObj.organization)
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
