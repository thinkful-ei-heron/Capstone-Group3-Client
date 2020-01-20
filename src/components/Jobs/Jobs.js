import React, { Component } from "react";
import { AuthContext } from "../../services/Auth";
import "./Jobs.css";
import JobItem from "./JobItem";
import LogHours from "../LogHours/LogHours";
import dbServices from "../../services/dbServices";

export default class Jobs extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      jobs: [],
      loading: true,
      showLogHours: false
    };
  }

  static contextType = AuthContext;

  onJobsUpdate = querySnapshot => {
    const jobs = [];

    if (this.context.currentUser.role === "project worker") {
      querySnapshot.forEach(doc => {
        if (
          doc.data().project_workers.includes(this.context.currentUser.name)
        ) {
          jobs.push(doc.data());
        }
      });
    } else if (this.context.currentUser.role === "project manager") {
      querySnapshot.forEach(doc => {
        if (doc.data().project_manager === this.context.currentUser.name) {
          jobs.push(doc.data());
        }
      });
    } else {
      querySnapshot.forEach(doc => {
        jobs.push(doc.data());
      });
    }

    this.setState({
      jobs,
      loading: false
    });
  };

  componentDidMount() {
    this.unsubscribe = dbServices
      .jobsListener(this.context.currentUser.org, this.props.projectId)
      .onSnapshot(this.onJobsUpdate);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderLogHoursForm = () => {
    this.setState({
      showLogHours: !this.state.showLogHours
    });
  };

  render() {
    const { jobs } = this.state;
    const user = this.context.currentUser;

    if (this.state.loading) {
      return <div></div>;
    } else {
      return (
        <>
          <div>
            <h2>
              {user.role === "project worker" ? (
                <button onClick={this.renderLogHoursForm}>LOG HOURS</button>
              ) : (
                <></>
              )}
            </h2>
            {this.state.showLogHours ? (
              <LogHours
                jobs={jobs}
                renderLogHoursForm={this.renderLogHoursForm}
              />
            ) : (
              <></>
            )}
          </div>
          <ul>
            {jobs.length > 0 ? (
              jobs.map(job => <JobItem job={job} key={job.id} />)
            ) : (
              <h4>There are currently no jobs to display for this project.</h4>
            )}
          </ul>
        </>
      );
    }
  }
}
