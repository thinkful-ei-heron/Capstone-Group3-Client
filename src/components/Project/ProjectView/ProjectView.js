import React, { Component } from "react";
import { ProgressBar } from "../../ProgressBar/ProgressBar";
import "./ProjectView.css";
import Loading from "../../Loading/Loading";
import { AuthContext } from "../../../services/Auth.js";
import Jobs from "../Jobs/Jobs";
import Statistics from "../../Statistics/Statistics";
import Sidebar from "../../Sidebar/Sidebar";
import JobForm from "../JobForm/JobForm";
import dbServices from "../../../services/dbServices";
import dateConversions from "../../../services/dateConversions";
import Swal from "sweetalert2";
import { CatchAll } from "../../CatchAll/CatchAll";

export default class ProjectView extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      project: null,
      showJobForm: false,
      loading: true,
      toggleState: false,
      progress: 0,
      total: 0,
      error: null
    };
  }

  static contextType = AuthContext;

  updateProject = data => {
    this.setState({
      project: data,
      loading: false
    });
  };

  getProgress = (jobProg, jobTotal, job) => {
    let currentProgress = 0;
    let currentTotal = 0;
    let newProject = this.state.project;

    currentProgress = currentProgress + jobProg;
    currentTotal = currentTotal + jobTotal;
    if (currentProgress === 0) {
      this.setState({
        progress: 0
      });
    } else {
      this.setState({
        progress: parseInt(currentProgress),
        total: currentTotal
      });

      newProject.progress = parseInt(
        ((currentProgress / currentTotal) * 100).toFixed(2)
      );
      dbServices.updateProject(newProject);
      this.setState({
        project: newProject
      });
    }
  };

  async componentDidMount() {
    try {
      this.unsubscribe = dbServices
        .projectsListener(this.context.currentUser.org, this.props.id)
        .onSnapshot(doc => {
          this.updateProject(doc.data());
        });
    } catch (error) {
      this.setState({
        error: "Error"
      });
      console.warn(error);
      Swal.fire({
        title: "Error!",
        text:
          "There was an issue loading this project's information - please refresh the page and try again.",
        icon: "error",
        confirmButtonText: "Close"
      });
    }
  }

  autoComplete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 
        'By clicking the button below, you will automatically mark this project as complete along with any unfinished tasks.',
      icon: 'question',
      confirmButtonText: 'I\'m sure!',
      onAfterClose: () => {
        let proj = this.state.project;
        proj.autoComplete = true;
        proj.date_completed = dateConversions.dateToTimestamp(new Date());
        dbServices.updateProject(proj)
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  showJobForm = () => {
    this.setState({
      showJobForm: !this.state.showJobForm
    });
  };

  render() {
    const { project, showJobForm } = this.state;
    const user = this.context.currentUser;

    if (this.state.loading && !this.state.error) {
      return <Loading />;
    } else if (this.state.error) {
      return <h2>Project was unable to load</h2>;
    } else {
      return (
        <>
          <div test-id="projectContainer" test-data={project.id}>
            <header id="company_header">
              <h2 id="companyName">{this.context.currentUser.org}</h2>
              <span id="currentDate">{new Date().toDateString()}</span>
            </header>
            <header className="ProjectView__header" id="project_header">
              <div id="name_manager">
                <h3 id="projectName">{project.name}</h3>
                <h4 id="projectManager" test-id="manager-name">
                  Manager: {project.project_manager}
                </h4>
              </div>
              <div id="project_description">
                <span>{project.description}</span>
              </div>
              <div id="project_progress">
                <span>Est. Progress</span>
                <ProgressBar
                  percentage={parseInt(this.state.project.progress)}
                />
              </div>
              {!this.state.project.autoComplete && this.state.project.progress !== 100 
                ? <button onClick={this.autoComplete}>Mark as Complete</button>
                : ''}
              <div id="project_deadline">
                <span>
                  Deadline: {dateConversions.TStoDisplayDate(project.deadline)}
                </span>
              </div>
            </header>
          </div>
          <div id="projectView_main">
            <div className="ProjectView__jobs_stats">
              {user.role === "project worker" ? (
                <></>
              ) : (
                <Statistics {...this.props} />
              )}
              <div className="ProjectView__jobs_header">
                {user.role === "project worker" ? (
                  <h3>Your Tasks</h3>
                ) : (
                  <h3>Tasks</h3>
                )}
                {user.role === "project worker" ? (
                  ""
                ) : (
                  <button onClick={this.showJobForm}>Add Task</button>
                )}
              </div>
              {showJobForm && (
                <JobForm
                  {...this.props}
                  setJob={this.setJob}
                  project={project}
                  showJobForm={this.showJobForm}
                  projectId={this.props.id}
                />
              )}
              <Jobs projectId={this.props.id} getProgress={this.getProgress} />
            </div>
            <div className="ProjectView__sidebar">
              <Sidebar view="project" project={this.state.project} />
              <h1>Sidebar</h1>
            </div>
          </div>
        </>
      );
    }
  }
}
