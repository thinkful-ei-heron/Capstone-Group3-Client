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
      selectedProjectManager: null,
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

  renderJobList = () => {
    return this.state.project.jobs.map(job => {
      return (
        <Jobs job={job} />
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
              <div id="project_description">
                <span>{project.description}</span>
              </div>
              <div id="project_progress">
                <span>Est. Progress</span>
              </div>
              <ProgressBar percentage={project.progress} />
              <div id="project_deadline">
                <span>Deadline: {project.deadline}</span>
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
                </div>
              ) : ''}
            </header>
          </div>
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
          </div>
          <Sidebar view="project" />
        </div>
      );
    }
  }
}
