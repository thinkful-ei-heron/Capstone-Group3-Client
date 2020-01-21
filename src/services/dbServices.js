import app from "./base";

const db = app.firestore();

const dbServices = {
  createOwner(user, org) {
    const addOrg = async () =>
      await db
        .collection("organizations")
        .doc(org)
        .set({
          name: org
        });
    user.role = "owner";
    addOrg().then(() => this.createUserInOrg(user, org));
    return "success";
  },

  createUserInOrg(newUser, org) {
    newUser.new = true;
    return db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .doc(newUser.email)
      .set(newUser);
  },

  jobsListener(org, id) {
    return db
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .doc(id)
      .collection("jobs");
  },

  promoteUser(org, email) {
    return db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .where("email", "==", email)
      .doc()
      .update({ role: "project manager" });
  },

  projectsListener(org, id) {
    return db
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .doc(id);
  },

  async getEmployeeProjects(name, org) {
    return db
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .where("project_workers", "array-contains", name)
      .get();
  },

  async getManagerProjects(name, org) {
    return db
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .where("project_manager", "==", name)
      .get();
  },

  async getProjectJobsForEmployee(name, org, id) {
    return db
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .doc(id)
      .collection("jobs")
      .where("project_workers", "array-contains", name)
      .get();
  },

  async initDashboard(name, role, org) {
    const projs = [];
    const managers = [];

    //get projects
    const projects = await dbServices.getProjectsByRole({
      name: name,
      org: org,
      role: role
    });

    projects.forEach(proj => projs.push(proj.data()));

    //get projectManagers
    if (role === "owner") {
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
    if (user.role === "project worker") {
      return db
        .collection("organizations")
        .doc(user.org)
        .collection("projects")
        .where("project_workers", "array-contains", user.name)
        .get();
    }
    if (user.role === "project manager") {
      return db
        .collection("organizations")
        .doc(user.org)
        .collection("projects")
        .where("project_manager", "==", user.name)
        .get();
    }
    return db
      .collection("organizations")
      .doc(user.org)
      .collection("projects")
      .get();
  },

  getProjectById(id, org) {
    return db
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .doc(id)
      .get();
  },

  addProject(newProject) {
    // console.log(newProject.org_id);
    if (!newProject.project_manager) newProject.project_manager = "unassigned";
    return db
      .collection(`organizations/${newProject.org_id}/projects`)
      .add(newProject);
  },

  setProjId(id, orgId) {
    // console.log(id, orgId);
    return db
      .collection(`organizations/${orgId}/projects`)
      .doc(`${id}`)
      .update({ id: id });
  },

  updateProject(proj) {
    console.log(proj);
    return db
      .collection("organizations")
      .doc(proj.org_id)
      .collection("projects")
      .doc(proj.id)
      .update(proj);
  },

  setProjectsManager(projId, org, pm) {
    return db
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .doc(projId)
      .update({ project_manager: pm });
  },

  getUser(email, org) {
    return db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .where("email", "==", email)
      .get();
  },

  // getPeople(org, type) {
  //   return db
  //     .collection('organizations')
  //     .doc(org)
  //     .collection('users')
  //     .where('role', '==', type)
  //     .getString('name');
  // },

  async getJobs(org, id) {
    return db
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .doc(id)
      .collection("jobs")
      .get();
  },

  async getEmployees(org) {
    return db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .where("role", "==", "project worker")
      .get();
  },

  getProjectManagers(org) {
    return db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .where("role", "==", "project manager")
      .get();
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
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .doc(project_id)
      .collection("jobs")
      .doc(id)
      .update({ edit: edit });
  },

  async updateProjectWorkers(id, workers, org) {
    await db
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .doc(id)
      .update({ project_workers: workers });
  },

  async updateJob(jobObj) {
    await db
      .collection("organizations")
      .doc(jobObj.organization)
      .collection("projects")
      .doc(jobObj.project_id)
      .collection("jobs")
      .doc(jobObj.id)
      .update({ ...jobObj });
  },

  async updateJobStatus(id, status, project_id, approval, org) {
    await db
      .collection("organizations")
      .doc(org)
      .collection("projects")
      .doc(project_id)
      .collection("jobs")
      .doc(id)
      .update({
        status: status,
        approval: approval
      });
  },

  async updateJobApproval(id, project_id) {
    await db
      .collection("organizations")
      .doc(this.state.user.org)
      .collection("projects")
      .doc(project_id)
      .collection("job")
      .doc(id)
      .update({ approval: true, status: "complete" });
  },

  async editJob(id, jobObj) {
    await db
      .collection("organizations")
      .doc(jobObj.organization)
      .collection("projects")
      .doc(jobObj.project_id)
      .collection("jobs")
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
  },

  async updateWorker(worker, org) {
    await db
      .collection("organizations")
      .doc(org)
      .collection("users")
      .doc(worker.email)
      .update({ ...worker });
  }
};

export default dbServices;
