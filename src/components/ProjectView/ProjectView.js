
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import FirebaseContext from '../../services/context.js';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import './ProjectView.css';
import Loading from '../Loading/Loading';
import Jobs from '../Jobs/Jobs';
import Dropdown from '../Dropdown/Dropdown';
import Statistics from '../Statistics/Statistics';
import Sidebar from '../Sidebar/Sidebar';


export default class ProjectView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "Brennan Huff", //pass in through props or context
      userRole: "owner",
      companyName: "", //pass in through props or context
      date: new Date().toDateString(),
      projectName: "",
      projectDescription: "",
      projectProgress: 0,
      projectDeadline: "",
      projectManager: "",
      projectJobs: [],
      projectEmployees: [],
      loading: true,
    };
  }

  static contextType = FirebaseContext;

  componentDidMount() {
    console.log(this.props.id);
    const jobs = this.context.jobs;
    console.log(jobs);
    const projects = this.context.projects;
    const proj = projects.find(project => project.id === this.props.id);
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
      loading: false,
    });
  }

  renderEmployeeList = job => {
    return job.project_workers.map((employee, index) => {
      let itemKey = index + employee;
      return <li key={itemKey}>{employee}</li>;
    });
  };

  renderJobList = () => {
    return this.state.projectJobs.map((job, index) => {
      return (
        <li key={index} id={index}>
          <button>^</button>
          <h4>{job.jobName}</h4>
          <span>{job.jobDetails}</span>
          <div className="job-progress">
            <ProgressBar percentage={job.jobProgress} />
          </div>
          {job.jobApproval || job.jobProgress !== 100 ? (
            <button disabled>Submit For Approval</button>
          ) : (
            <button>Submit For Approval</button>
          )}
          <ul>{this.renderEmployeeList(job)}</ul>
        </li>
      );
    });
  };


  // componentDidMount() {
  //   this.context.doGetProject().then(snapshot => {
  //     snapshot.forEach(doc => {
  //       if (doc.data().name === 'Project Management App') {
  //         //Pass in prop of Project Name to grab correct data
  //         let newProjectName = doc.data().name;
  //         let newProjetDescription = doc.data().description;
  //         let newProjectDeadline = new Date(doc.data().deadline.seconds * 1000).toDateString();
  //         let newProjectManager = doc.data().project_manager;
  //         let newProjectProgress = doc.data().progress;
  //         this.setState({
  //           projectName: newProjectName,
  //           projectDescription: newProjetDescription,
  //           projectDeadline: newProjectDeadline,
  //           projectManager: newProjectManager,
  //           projectProgress: newProjectProgress,
  //           loading: false
  //         });
  //       }
  //     });
  //   });
  // }

  render() {
    if (this.state.loading) {
      return <Loading />;
    } else {
      return (
        <div>
          <header id="employee-view-header-company">
            <h2 id="companyName">{this.state.companyName}</h2>
            <span id="">{this.state.date}</span>
          </header>
          <div>
            <header id="employee-view-project-header">
              <div id="project-name-manager">
                <h3 id="projectName">{this.state.projectName}</h3>
                <h4 id="projectManager">
                  Manager: {this.state.projectManager}
                </h4>
              </div>
              <div id="projectDescription">{this.state.projectDescription}</div>
              <div>Est. Progress</div>
              <ProgressBar percentage={this.state.projectProgress} />

              <div id="projectDeadline">Deadline: {this.state.projectDeadline}</div>
              {this.state.userRole === 'project worker' ? (

                <></>
              ) : (
                <div>
                  <h3>SELECT Project Manager</h3>
                  <Dropdown path="project" />
                </div>
              )}
            </header>
          </div>
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
              {this.state.jobs &&
                this.state.projectJobs.map((job, i) => {
                  //  console.log(job.data())
                  return <Jobs key={i} id={job.id} job={job.details} />;
                })}
            </ul>
          </div>
          <Sidebar view="project" />
        </div>
      );
    }
  }
}
