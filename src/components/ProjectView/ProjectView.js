import React, { Component } from "react";
import FirebaseContext from "../../services/context.js";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import "./ProjectView.css";
import Loading from "../Loading/Loading";
import Jobs from "../Jobs/Jobs";
import Dropdown from "../Dropdown/Dropdown";
import Statistics from "../Statistics/Statistics";
import Sidebar from "../Sidebar/Sidebar";
import NewJob from '../NewJob/NewJob';

export default class ProjectView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {
        name: "",
        description: "",
        progress: "",
        deadline: "",
        project_manager: "",
        jobs: [],
        project_workers: []
      },
      showJobForm: false,
      loading: true,
      toggleState: false
    };
  }

  static contextType = FirebaseContext;

  componentDidMount() {
    const jobs = this.context.jobs;
    const projects = this.context.projects;
    const proj = projects.find(project => project.id === this.props.id);
    const projJobs = jobs.find(job => job.project_id === this.props.id);
    this.setState({
      project: {
        name: proj.name,
        description: proj.description,
        progress: proj.progress,
        deadline: proj.deadline,
        project_manager: proj.project_manager,
        jobs: projJobs,
        project_workers: proj.project_workers
      },
      loading: false,
    });
  }

  setJob = () => {
    this.setState({
      toggleState: !this.state.toggleState
    })
    // this.context.setNewJob(job)
    // console.log(this.context.jobs)
  }

  renderEmployeeList = jobWorkers => {
    return jobWorkers.map((employee, index) => {
      let itemKey = index + employee;
      return <li key={itemKey}>{employee}</li>;
    });
  };

  renderJobList = () => {
    return this.state.project.jobs.map(job => {
      return (
        <li key={job.id} id={job.id}>
          <button>^</button>
          <h4>{job.name}</h4>
          <span>{job.description}</span>
          <div className="job-progress">
            <ProgressBar percentage={job.progress} />
          </div>
          {job.approval || job.progress !== 100 ? (
            <button disabled>Submit For Approval</button>
          ) : (
            <button>Submit For Approval</button>
          )}
          <ul>{this.renderEmployeeList(job.job_workers)}</ul>
        </li>
      );
    });
  };

  showJobForm = () => {
    this.setState({
      showJobForm: !this.state.showJobForm
    })
  }

  render() {
    const { project, showJobForm } = this.state
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <div>
          <header id="employee-view-header-company">
            <h2 id="companyName">{this.context.user.org.name}</h2>
            <span id="">{new Date().toDateString()}</span>
          </header>
          <div>
            <header id="employee-view-project-header">
              <div id="project-name-manager">
                <h3 id="projectName">{project.name}</h3>
                <h4 id="projectManager">
                  Manager: {project.project_manager}
                </h4>
              </div>
              <div id="projectDescription">{project.description}</div>
              <div>Est. Progress</div>
              <ProgressBar percentage={project.progress} />

              <div id="projectDeadline">Deadline: {project.deadline}</div>
              {this.context.user.role === 'project worker' ? (

                <></>
              ) : (
                <div>
                  <h3>SELECT Project Manager</h3>
                  {/* <Dropdown path="project" /> */}
                </div>
              )}
            </header>
          </div>
          <div id="employee-view-jobs">

            {this.context.user.role === 'project worker' ? <></> : <Statistics />}

            <h3>Your Jobs</h3>
            <button onClick={this.showJobForm}>Add Job</button>
            {showJobForm ? <NewJob {...this.props} setJob={this.setJob} project={project} showJobForm={this.showJobForm} projectId={this.props.id}/> : ''}
            {<ul>{this.renderJobList()}</ul>}
            {/* <ul>
              {this.state.project.jobs &&
                this.state.projectJobs.map((job, i) => {
                  //  console.log(job.data())
                  return <Jobs key={i} id={job.id} job={job.details} />;
                })}
            </ul> */}
          </div>
          <Sidebar view="project" />
        </div>
      );
    }
  }
}
