import React, { Component } from "react";
//import FirebaseContext from "../../services/context.js";
import { AuthContext } from '../../services/Auth.js';
import { ProgressBar } from "../ProgressBar/ProgressBar";
import "./ProjectView.css";
import Loading from "../Loading/Loading";
import Jobs from "../Jobs/Jobs";
import Dropdown from "../Dropdown/Dropdown";
import Statistics from "../Statistics/Statistics";
import { Sidebar } from "../Sidebar/Sidebar";
import JobForm from "../JobForm/JobForm";
import dbServices from "../../services/dbServices";
import app from '../../services/base';

export default class ProjectView2 extends Component {
  static contextType = AuthContext;
  
  constructor(props) {
    super(props);
    this.ref = app.firestore().collection('organizations')
    this.unsubscribe = null;
    this.state = {
      project: null,
      user: {
        role: 'project manager'
      }
    };
  }

  updateProject = (data) => {
    this.setState({
      project: data
    })
  }

  componentDidMount() {
    this.unsubscribe = this.ref.doc(this.context.currentUser.displayName)
      .collection('projects')
      .doc(this.props.id)
      .onSnapshot(doc => {
        this.updateProject(doc.data())
      }, error => console.error(error))
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { project, user } = this.state;
    return (
      <>
        <header id="company_header">
            <h2 id="companyName">Org Name Here</h2>
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
                <span>Deadline: {new Date(project.deadline.seconds * 1000).toDateString()}</span>
              </div>
              {/* {user.role === 'owner' && project.project_manager === 'unassigned' ? (
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
              )} */}
            </header>
          </div>
          <div>
            {/* <h2>
              {user.role === "project worker" ? (
                <button onClick={e => this.renderLogHoursForm(e)}>
                  LOG HOURS
                </button>
              ) : (
                <></>
              )}
            </h2> */}
            {/* {this.state.showLogHours ? (
              <LogHours jobs={this.state.project.jobs} />
            ) : (
              <></>
            )} */}
          </div>
          <div id="projectView_main">
            <div id="jobs_stats_container">
              {/* {user.role === 'project worker' ? <></> : <Statistics />} */}
              <div id="jobs_container">
                {/* {user.role === 'project worker' ? <h3>Your Jobs</h3> : <h3>Jobs</h3>} */}
                {/* {user.role === 'project worker' ? (
                  ''
                ) : (
                  <button onClick={this.showJobForm}>Add Job</button>
                )} */}
              </div>
              {/* {showJobForm && user.role === "project manager" ? (
                <JobForm
                  {...this.props}
                  setJob={this.setJob}
                  project={project}
                  showJobForm={this.showJobForm}
                  projectId={this.props.id}
                  setJobs={this.setJobs}
                  setProjectWorkers={this.setProjectWorkers}
                />
              ) : (
                ''
              )} */}
              {/* {<ul>{this.renderJobList()}</ul>} */}
            </div>
            <div id="sidebar_container">
              {/* <Sidebar view="project" /> */}
            </div>
          </div>
      </>
    )
  }
}

