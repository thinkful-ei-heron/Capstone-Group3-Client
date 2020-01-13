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

  handleApprovalSubmit = async (id, status, approval = false) => {
    let jobs = [];
    console.log(id);
    await this.context.updateJobStatus(
      id,
      status,
      this.props.job.project_id,
      approval
    );
    await this.context.updateAndSetJobs(id, status);
    console.log(jobs);
  };

  handleJobApproval = async id => {
    await this.context.updateJobApproval(id, this.props.job.project_id);
    await this.context.updateAndSetJobs(id, "Complete");
  };

  renderEmployeeList = jobWorkers => {
    if (!jobWorkers || jobWorkers.length === 0)
      return <h5>No Workers Assigned</h5>;
    return jobWorkers.map((employee, index) => {
      let itemKey = index + employee;
      return <li key={itemKey}>{employee}</li>;
    });
  };

  renderProjectButtons(approval, progress, id, status) {
    if (this.context.user.role === "project worker") {
      if (status === "completed" && status !== "submitted")
        return <span>Project Completed</span>;
      if (status === "submitted" || status === "completed") return <></>;
      if (approval || progress !== 100) {
        return <button disabled>Submit for Approval</button>;
      } else {
        return (
          <>
            {status === "revisions" ? <span>Revision Requested</span> : <></>}
            <button
              onClick={e => this.handleApprovalSubmit(id, "submitted", false)}
            >
              Submit for Approval
            </button>
          </>
        );
      }
    }

    if (
      this.context.user.role === "project manager" ||
      this.context.user.role === "admin"
    ) {
      if (status === "completed") return <span>Job Completed</span>;
      return (
        <>
          {!approval && progress === 100 && status !== "revisions" ? (
            <span>AWAITING APPROVAL</span>
          ) : (
            <></>
          )}
          {!approval && progress === 100 && status === "revisions" ? (
            <span>Revision Requested</span>
          ) : (
            <></>
          )}
          {/* <button>Assign</button>
          <button>Edit</button> */}
          {status === "submitted" ? (
            <div>
              <button
                onClick={e => this.handleApprovalSubmit(id, "completed", true)}
              >
                Approve
              </button>{" "}
              <button onClick={e => this.handleApprovalSubmit(id, "revisions")}>
                Request Revision
              </button>
            </div>
          ) : (
            <></>
          )}
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
          {this.renderProjectButtons(
            job.approval,
            job.progress,
            job.id,
            job.status
          )}
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
