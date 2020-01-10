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
<<<<<<< HEAD
      userName: "", //pass in through props or context
      userRole: "",
      companyName: "", //pass in through props or context
      date: new Date().toDateString(),
      projectName: "",
      projectDescription: "",
      projectProgress: 0,
      projectDeadline: "",
      projectManager: "",
      projectJobs: [],
      projectEmployees: [],
=======
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
>>>>>>> origin
      loading: true,
      toggleState: false
    };
  }

  static contextType = FirebaseContext;

  componentDidMount() {
<<<<<<< HEAD
    const jobs = this.context.jobs;
    const projects = this.context.projects;
    const proj = projects.find(project => project.id === this.props.id);
    console.log(proj)
    this.setState({
      userName: this.context.user.name,
      userRole: this.context.user.role,
      companyName: this.context.user.org.name,
      projectJobs: jobs,
      projectName: proj.name,
      projectDescription: proj.description,
      projectProgress: proj.progress,
      projectDeadline: proj.Deadline,
      projectManager: proj.project_manager,
      projectEmployees: proj.project_workers,
      loading: false
=======
    console.log(this.context.user)
    const jobs = this.context.jobs;
    const projects = this.context.projects;
    const proj = projects.find(project => project.id === this.props.id);
    const projJobs = jobs.filter(job => job.project_id === this.props.id);
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
      selectedProjectManager: null,
      loading: false,
>>>>>>> origin
    });
  }

  setJob = () => {
    this.setState({
      toggleState: !this.state.toggleState
    })
    // this.context.setNewJob(job)
    // console.log(this.context.jobs)
  }

  renderJobList = () => {
    const jobs = this.context.jobs.filter(job => job.project_id === this.props.id)
    return jobs.map(job => {
      return (
        <Jobs job={job} key={job.id}/>
      )
    });
  };

  showJobForm = () => {
    this.setState({
      showJobForm: !this.state.showJobForm
    })
  }

  setSelected = employee => {
    this.setState({
      selectedProjectManager: employee
    })
  }

  setProjectManager = () => {
    //code to set new PM for project
  }

  render() {
    const { project, showJobForm } = this.state
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <div>
          <header id="company_header">
            <h2 id="companyName">{this.context.user.org.name}</h2>
            <span id="currentDate">{new Date().toDateString()}</span>
          </header>
          <div>
            <header id="project_header">
              <div id="name_manager">
                <h3 id="projectName">{project.name}</h3>
                <h4 id="projectManager">
                  Manager: {project.project_manager}
                </h4>
              </div>
<<<<<<< HEAD
              <div id="projectDescription">{this.state.projectDescription}</div>
              <div>Est. Progress</div>
              <ProgressBar percentage={this.state.projectProgress} />

              <div id="projectDeadline">Deadline: {this.state.projectDeadline}</div>
              {this.state.userRole === 'project worker' ? (

                <></>
              ) : (
                <div>
                  {!this.state.projectManager ?
                    <div>
                      <h3>SELECT Project Manager</h3>
                      <Dropdown path="project" />
                    </div> : <></>
                  }  
=======
              <div id="project_description">
                <span>{project.description}</span>
              </div>
              <div id="project_progress">
                <span>Est. Progress</span>
              </div>
              <ProgressBar percentage={project.progress} />
              <div id="project_deadline">
                <span>Deadline: {new Date(project.deadline.toString()).toDateString()}</span>
              </div>
              {this.context.user.role === 'owner' && project.project_manager === 'unassigned' ? (
                <div id="select_pm">
                  <h3>SELECT Project Manager</h3>
                  <Dropdown 
                    employees={this.context.employees.filter(emp => emp.role === 'project manager')} 
                    isMulti={false}
                    setSelected={this.setSelected}
                  />
                  {this.state.selectedProjectManager ? 
                    <div id="submit_pm">
                      <button onClick={this.setProjectManager}></button>
                    </div>
                    : ''}
>>>>>>> origin
                </div>
              ) : ''}
            </header>
          </div>
<<<<<<< HEAD
          <div id="employee-view-jobs">

            {this.state.userRole === 'project worker' ? <></> : <Statistics />}

            <h3>Your Jobs</h3>
            {this.state.userRole === 'project worker' ? <></> : 
            <Link to={{
              pathname: '/new_job',
              state: {
                project_id: this.props.id,
                project_manager: this.state.projectManager
              }
            }}>
            <button type='button' id='addJob'>Add Job</button>
            </Link>}
            {<ul>{this.renderJobList()}</ul>}
            <ul>
              {this.state.projectJobs &&
                this.state.projectJobs.map((job, i) => {
                  console.log(job[0])
                  return <Jobs key={i} job={job[0]} />;
                })}
            </ul>
=======
          <div id="jobs_stats_container">
            {this.context.user.role === 'project worker' ? <></> : <Statistics />}
            <div id="jobs_container">
              {this.context.user.role === 'project worker' ? <h3>Your Jobs</h3> : <h3>Jobs</h3>}
              {this.context.user.role === 'project worker' ? '' : <button onClick={this.showJobForm}>Add Job</button>}
              {showJobForm ? 
                <NewJob 
                  {...this.props} 
                  setJob={this.setJob} 
                  project={project} 
                  showJobForm={this.showJobForm} 
                  projectId={this.props.id}
                /> : ''}
              {<ul>{this.renderJobList()}</ul>}
            </div>
>>>>>>> origin
          </div>
          <Sidebar view="project" />
        </div>
      );
    }
  }
}
