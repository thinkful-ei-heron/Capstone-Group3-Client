import React, { Component } from "react";
import FirebaseContext from "../../services/context.js";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import "./ProjectView.css";
import Loading from "../Loading/Loading";
import Jobs from "../Jobs/Jobs";
import Dropdown from "../Dropdown/Dropdown";
import Statistics from "../Statistics/Statistics";
import Sidebar from "../Sidebar/Sidebar";

export default class ProjectView extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      loading: true,
    };
  }

  static contextType = FirebaseContext;

  componentDidMount() {
    const jobs = this.context.jobs;
    const projects = this.context.projects;
    const proj = projects.find(project => project.id === this.props.id);
    console.log(proj)
    this.setState({
      companyName: this.context.user.org.name,
      projectJobs: jobs,
      projectName: proj.name,
      projectDescription: proj.description,
      projectProgress: proj.progress,
      projectDeadline: proj.Deadline,
      projectManager: proj.project_manager,
      projectEmployees: proj.project_workers,
      loading: false,
      userRole: this.context.user.role
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

  render() {
    console.log("this.context.jobs", this.context.jobs);
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
              <div id="projectDeadline">
                Deadline: {this.state.projectDeadline}
              </div>
              {this.state.userRole === "project worker" ? (
                <></>
              ) : (
                <div>
                  {!this.state.projectManager ?
                    <div>
                      <h3>SELECT Project Manager</h3>
                      <Dropdown path="project" />
                    </div> : <></>
                  }  
                </div>
              )}
            </header>
          </div>
          <div id="employee-view-jobs">
            {this.state.userRole === "project worker" ? <></> : <Statistics />}
            {this.state.userRole === "project worker" ?<h3>Your Jobs</h3> : <h3>Jobs</h3>}
            <ul>
              {this.state.projectJobs &&
                this.state.projectJobs.map((job, i) => {
                  console.log(job[0])
                  return <Jobs key={i} job={job[0]} />;
                })}
            </ul>
          </div>
          <Sidebar view="project" />
        </div>
      );
    }
  }
}
