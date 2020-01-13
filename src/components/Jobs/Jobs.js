import React, { Component } from "react";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import FirebaseContext from "../../services/context.js";

export default class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandJob: false
    };
  }

  static contextType = FirebaseContext;

  renderEmployeeList = jobWorkers => {
    if (!jobWorkers || jobWorkers.length === 0)
      return <h5>No Workers Assigned</h5>;
    return jobWorkers.map((employee, index) => {
      let itemKey = index + employee;
      return <li key={itemKey}>{employee}</li>;
    });
  };

  renderProjectButtons(approval, progress) {
    if (this.context.user.role === "project worker") {
      if (approval || progress !== 100) {
        return <button disabled>Submit for Approval</button>;
      } else {
        return <button>Submit for Approval</button>;
      }
    }
    if (
      this.context.user.role === "project manager" ||
      this.state.userRole === "owner"
    ) {
      return (
        <>
          {!approval && progress === 100 ? <span>AWAITING APPROVAL</span> : ""}
          <button>Assign</button>
          <button>Edit</button>
        </>
      );
    }
  }

  toggleExpand = () => {
    this.setState({
      expandJob: !this.state.expandJob
    });
  };

  componentDidMount() {
    this.setState({
      userRole: this.context.user.role
    });
  }

  render() {
    let job = this.props.job;
    return (
      <>
        {/* JOB ID IS NOT ATTACHED TO JOB OBJECT, KEY WAS UNDEFINED AND NOT UNIQUE*/}
        <li key={job.id} id={job.id}>
          <button onClick={this.toggleExpand}>
            {this.state.expandJob ? "-" : "+"}
          </button>
          <h4>{job.name}</h4>
          <span>{job.description}</span>
          <div className="job-progress">
            <ProgressBar percentage={job.progress} />
          </div>
          {this.renderProjectButtons(job.approval, job.progress)}
          {this.state.expandJob ? (
            <ul>{this.renderEmployeeList(job.project_workers)}</ul>
          ) : (
            ""
          )}
        </li>
      </>
    );
  }
}
