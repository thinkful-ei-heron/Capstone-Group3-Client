import React, { Component } from "react";
import { Link } from "react-router-dom";
import dbServices from "../../services/dbServices";
import JobForm from "../JobForm/JobForm";

export default class JobNotificationList extends Component {
  state = {
    editing: false,
    editJob: null,
    notificationList: []
  };

  componentDidMount() {
    this.setState({
      notificationList: this.props.notificationList
    });
  }

  handleApprovalSubmit = async (id, status, approval = false, jobObj) => {
    // let jobData = this.state.notificationList.find(item => item.id === id);
    // let projectId = jobData.project_id;
    jobObj.approval = approval;
    if (status === "completed" || status === "revisions") {
      jobObj.alert = jobObj.project_workers;
    }
    jobObj.status = status;
    await dbServices.updateJob(jobObj);
    this.props.updateList(jobObj);
    this.setState({
      notificationList: this.props.notificationList
    });
  };

  handleClick = async (id, jobObj) => {
    if (
      this.props.user.role === "project manager" ||
      this.props.user.role === "owner"
    )
      return null;
    else {
      let newAlert = jobObj.alert.filter(name => name !== this.props.user.name);
      jobObj.alert = newAlert;
      await dbServices.updateJob(jobObj);
    }
  };

  openEdit = (jobObj = null) => {
    if (jobObj === null) this.props.updateList(this.state.editJob);
    this.setState({
      editing: !this.state.editing,
      editJob: jobObj,
      notificationList: this.props.notificationList
    });
  };

  renderJobEdit = job => {
    let jobKeys = Object.keys(job.edit);
    return jobKeys.map((jobKey, index) => {
      if (job.edit[jobKey] && jobKey !== "employee") {
        return (
          <li key={index + jobKey}>
            {jobKey}: {job.edit[jobKey]}
          </li>
        );
      } else return <></>;
    });
  };

  renderEmployeeNotificationDetails = jobObj => {
    if (jobObj.status === "in progress")
      return <span>You have been added to {jobObj.name}.</span>;
    if (jobObj.status === "submitted")
      return <span>{jobObj.name} has been submitted for review.</span>;
    if (jobObj.status === "revisions")
      return <span>{jobObj.name} has been returned for revisions.</span>;
    if (jobObj.status === "completed")
      return <span>{jobObj.name} has been completed!</span>;
  };

  renderJobList = () => {
    return this.state.notificationList.map(jobObj => {
      return (
        <li key={jobObj.id} className="notification_job">
          <Link
            to={{
              pathname: `/project/${jobObj.project_id}`
            }}
            onClick={() => this.handleClick(jobObj.id, jobObj)}
          >
            {jobObj.name}
          </Link>
          {this.props.user.role === "project manager" ? (
            <>
              {jobObj.status === "submitted" ? (
                <div>
                  <h5>Job Submitted For Approval</h5>
                  <button
                    onClick={e =>
                      this.handleApprovalSubmit(
                        jobObj.id,
                        "completed",
                        true,
                        jobObj
                      )
                    }
                  >
                    Approve
                  </button>
                  <button
                    onClick={e =>
                      this.handleApprovalSubmit(
                        jobObj.id,
                        "revisions",
                        false,
                        jobObj
                      )
                    }
                  >
                    Request Revision
                  </button>
                </div>
              ) : (
                <></>
              )}
              {jobObj.status === "edit request" ? (
                <div>
                  <ul>{this.renderJobEdit(jobObj)}</ul>
                  <button onClick={() => this.openEdit(jobObj)}>
                    Submit Edit
                  </button>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          {this.props.user.role === "project worker" ? (
            <p>{this.renderEmployeeNotificationDetails(jobObj)}</p>
          ) : (
            <></>
          )}
        </li>
      );
    });
  };

  render() {
    return (
      <div>
        <ul>{this.renderJobList()}</ul>
        {this.state.editing ? (
          <JobForm showJobForm={this.openEdit} job={this.state.editJob} />
        ) : (
          <></>
        )}
      </div>
    );
  }
}
