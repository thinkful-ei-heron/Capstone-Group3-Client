import React, { Component } from 'react';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import JobForm from '../JobForm/JobForm';
import dbServices from '../../services/dbServices';
import WorkerEditForm from '../WorkerEditForm/WorkerEditForm';
import StyleIcon from '../StyleIcon/StyleIcon';

class JobItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandJob: false,
      showEditForm: false,
      showWorkerEditForm: false,
      role: 'project manager'
    };
  }

  handleApprovalSubmit = async (id, status, approval = false) => {
    await dbServices.updateJobStatus(
      id,
      status,
      this.props.job.project_id,
      approval,
      this.props.job.organization
    );
  };

  renderEmployeeList = jobWorkers => {
    if (!jobWorkers || jobWorkers.length === 0) return <span>No Workers Assigned</span>;
    return jobWorkers.map((employee, index) => {
      let itemKey = index + employee;
      return <li key={itemKey}>{employee}</li>;
    });
  };

  renderProjectButtons(approval, total_hours, hours_completed, id, status) {
    const progress = Math.floor((hours_completed / total_hours) * 100);
    if (this.state.role === 'project worker') {
      if (status === 'completed') return <span>Project Completed</span>;
      if (status === 'submitted' || status === 'completed') return <></>;
      if (approval || progress !== 100) {
        return (
          <>
            <button disabled>Submit for Approval</button>
            {(status !== 'completed' || status !== 'submitted') && status !== 'edit request' ? (
              <button onClick={e => this.showWorkerEditForm()}>Request Edit</button>
            ) : (
              <></>
            )}
          </>
        );
      } else {
        return (
          <>
            {status === 'revisions' ? <span>Revision Requested</span> : <></>}
            <button onClick={e => this.handleApprovalSubmit(id, 'submitted', false)}>
              Submit for Approval
            </button>
          </>
        );
      }
    }

    if (this.state.role === 'project manager' || this.state.role === 'admin') {
      if (status === 'completed') return <span>Job Completed</span>;
      return (
        <>
          {!approval && progress === 100 && status !== 'revisions' ? <span>AWAITING APPROVAL</span> : <></>}
          {!approval && progress === 100 && status === 'revisions' ? <span>Revision Requested</span> : <></>}
          <div className="JobItem__edit" onClick={this.showEditForm}>
            {StyleIcon({ style: 'edit' })}
          </div>
          {status === 'submitted' ? (
            <div>
              <button onClick={e => this.handleApprovalSubmit(id, 'completed', true)}>Approve</button>{' '}
              <button onClick={e => this.handleApprovalSubmit(id, 'revisions')}>Request Revision</button>
            </div>
          ) : (
            <></>
          )}
        </>
      );
    }
  }

  toggleExpand = e => {
    this.setState({
      expandJob: !this.state.expandJob
    });
  };

  showEditForm = e => {
    e.stopPropagation();
    this.setState({
      showEditForm: !this.state.showEditForm
    });
  };

  showWorkerEditForm = e => {
    e.stopPropagation();
    this.setState({
      showWorkerEditForm: !this.state.showWorkerEditForm
    });
  };

  render() {
    const job = this.props.job;
    const progress = Math.floor((job.hours_completed / job.total_hours) * 100);
    return (
      <li className="JobItem" key={job.id} id={job.id} onClick={this.toggleExpand}>
        <div className="JobItem__icon">
          {StyleIcon({
            style: `${this.state.expandJob ? 'expand' : 'collapse'}`
          })}
        </div>
        <span className="JobItem__name">{job.name}</span>
        <div className="JobItem__details">
          <span>Details:</span>
          <div className="JobItem__details_text">{job.description}</div>
        </div>
        <div className="JobItem__progress">
          <span>Est. Progress</span>
          <ProgressBar percentage={progress} />
        </div>
        <div className="JobItem__buttons">
          {this.renderProjectButtons(job.approval, job.total_hours, job.hours_completed, job.id, job.status)}
        </div>
        {this.state.showEditForm && (
          <div className="JobItem__form">
            <JobForm showJobForm={this.showEditForm} job={job} />
          </div>
        )}
        {this.state.showWorkerEditForm && this.state.role === 'project worker' && (
          <WorkerEditForm
            job={job}
            renderEditForm={this.showWorkerEditForm}
            handleStatus={this.handleApprovalSubmit}
          />
        )}
        {this.state.expandJob ? <ul>{this.renderEmployeeList(job.project_workers)}</ul> : ''}
      </li>
    );
  }
}

export default JobItem;
