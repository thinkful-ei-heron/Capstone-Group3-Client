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

  render() {
    let job = this.props.job;
    return (
      <>
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
            <ul>{this.renderEmployeeList(job.job_workers)}</ul>
          ) : (
            ""
          )}
        </li>
      </>
    );
  }
}
