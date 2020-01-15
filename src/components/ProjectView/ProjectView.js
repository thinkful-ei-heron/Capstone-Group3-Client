import React, { Component } from 'react';
import FirebaseContext from '../../services/context.js';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import './ProjectView.css';
import Loading from '../Loading/Loading';
import Jobs from '../Jobs/Jobs';
import Dropdown from '../Dropdown/Dropdown';
import Statistics from '../Statistics/Statistics';
import { Sidebar } from '../Sidebar/Sidebar';
import JobForm from '../JobForm/JobForm';

export default class ProjectView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {
        name: '',
        description: '',
        progress: '',
        deadline: '',
        project_manager: '',
        jobs: [],
        project_workers: []
      },
      showJobForm: false,
      loading: true,
      toggleState: false
    };
  }

  //static contextType = FirebaseContext;

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      const jobs = this.context.jobs;
      const projects = this.context.projects;
      const proj = projects.find(project => project.id === this.props.id);
      const projJobs = jobs.filter(job => job.project_id === this.props.id);
      this.setState({
        project: {
          name: proj.name,
          description: proj.description,
          progress: proj.progress,
          deadline: new Date(proj.deadline.seconds * 1000),
          project_manager: proj.project_manager,
          jobs: projJobs,
          project_workers: proj.project_workers
        },
        selectedProjectManager: null,
        loading: false
      });
    }
  }

  componentDidMount() {
    const jobs = this.context.jobs;
    const projects = this.context.projects;
    const proj = projects.find(project => project.id === this.props.id);
    const projJobs = jobs.filter(job => job.project_id === this.props.id);
    this.setState({
      project: {
        name: proj.name,
        description: proj.description,
        progress: proj.progress,
        deadline: new Date(proj.deadline.seconds * 1000),
        project_manager: proj.project_manager,
        jobs: projJobs,
        project_workers: proj.project_workers
      },
      selectedProjectManager: null,
      loading: false
    });
  }

  setJob = newJob => {
    this.setState({
      toggleState: !this.state.toggleState
    });
    // this.context.setNewJob(job)
    // console.log(this.context.jobs)
  };

  renderJobList = () => {
    const jobs = this.context.jobs.filter(job => job.project_id === this.props.id);
    return jobs.map(job => {
      return <Jobs job={job} key={job.id} />;
    });
  };

  showJobForm = () => {
    this.setState({
      showJobForm: !this.state.showJobForm
    });
  };

  setSelected = employee => {
    this.setState({
      selectedProjectManager: employee
    });
  };

  renderPmList = () => {
    let result = [];
    this.context.project_managers.forEach(pm => result.push(pm.name));
    return result;
  };

  setProjectManager = () => {
    //code to set new PM for project
  };

  render() {
    const { project, showJobForm } = this.state;
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <>
          <header id="company_header">
            <h2 id="companyName">{this.context.user.org}</h2>
            <span id="currentDate">{new Date().toDateString()}</span>
          </header>
          <div>
            <header id="project_header">
              <div id="name_manager">
                <h3 id="projectName">{project.name}</h3>
                <h4 id="projectManager">Manager: {project.project_manager}</h4>
              </div>
              <div id="project_description">
                <span>{project.description}</span>
              </div>
              <div id="project_progress">
                <span>Est. Progress</span>
                <ProgressBar percentage={project.progress} />
              </div>
              <div id="project_deadline">
                <span>Deadline: {new Date(project.deadline.toString()).toDateString()}</span>
              </div>
              {this.context.user.role === 'owner' && project.project_manager === 'unassigned' ? (
                <div id="select_pm">
                  <h3>SELECT Project Manager</h3>
                  <Dropdown employees={this.renderPmList()} isMulti={false} setSelected={this.setSelected} />
                  {this.state.selectedProjectManager ? (
                    <div id="submit_pm">
                      <button onClick={this.setProjectManager}></button>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              ) : (
                ''
              )}
            </header>
          </div>
          <div id="projectView_main">
            <div id="jobs_stats_container">
              {this.context.user.role === 'project worker' ? <></> : <Statistics />}
              <div id="jobs_container">
                {this.context.user.role === 'project worker' ? <h3>Your Jobs</h3> : <h3>Jobs</h3>}
                {this.context.user.role === 'project worker' ? (
                  ''
                ) : (
                  <button onClick={this.showJobForm}>Add Job</button>
                )}
              </div>
              {showJobForm ? (
                <JobForm
                  {...this.props}
                  setJob={this.setJob}
                  project={project}
                  showJobForm={this.showJobForm}
                  projectId={this.props.id}
                />
              ) : (
                ''
              )}
              {<ul>{this.renderJobList()}</ul>}
            </div>
            <div id="sidebar_container">
              <Sidebar view="project" />
            </div>
          </div>
        </>
      );
    }
  }
}
