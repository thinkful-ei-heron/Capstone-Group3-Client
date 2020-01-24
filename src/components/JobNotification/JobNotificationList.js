import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import dbServices from '../../services/dbServices'
import JobForm from '../Project/JobForm/JobForm'
import { AuthContext } from '../../services/Auth'
import StyleIcon from '../StyleIcon/StyleIcon'
import Swal from 'sweetalert2'
import dateConversions from '../../services/dateConversions'

export default class JobNotificationList extends Component {
  state = {
    editing: false,
    editJob: null,
    notificationList: [],
    error: false,
  }

  static contextType = AuthContext

  componentDidMount() {
    this.setState({
      notificationList: this.props.notificationList,
    })
  }

  setError = () => {
    this.setState({
      error: true,
    })
  }

  handleApprovalSubmit = async (id, status, approval = false, jobObj) => {
    // let jobData = this.state.notificationList.find(item => item.id === id);
    // let projectId = jobData.project_id;
    try {
      jobObj.approval = approval
      if (status === 'completed' || status === 'revisions') {
        jobObj.alert = jobObj.project_workers
      }
      if (status === 'completed')
        jobObj.date_completed = dateConversions.dateToTimestamp(new Date())
      jobObj.status = status
      await dbServices.updateJob(jobObj)
      this.props.updateList(jobObj)
      this.setState({
        notificationList: this.props.notificationList,
      })
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to post job update.',
        icon: 'error',
        confirmButtonText: 'Close',
        onClose: this.setError(),
      })
    }
  }

  handleClick = async (id, jobObj, e) => {
    if (
      this.context.currentUser.role === 'project manager' ||
      this.context.currentUser.role === 'owner'
    )
      return null
    else {
      try {
        let newAlert = jobObj.alert.filter(
          name => name !== this.context.currentUser.name
        )
        jobObj.alert = newAlert
        await dbServices.updateJobAlert(jobObj)
        this.props.updateList(jobObj)
        this.props.renderList(e)
        this.setState({
          notificationList: this.props.notificationList,
        })
      } catch (error) {
        console.log(error)
        Swal.fire({
          title: 'Error!',
          text:
            'Failed to update notification status. You are being directed to the project page.',
          icon: 'error',
          confirmButtonText: 'Close',
          onClose: this.setError(),
        })
      }
    }
  }

  openEdit = (jobObj = null) => {
    if (jobObj === null) this.props.updateList(this.state.editJob)
    this.setState({
      editing: !this.state.editing,
      editJob: jobObj,
      notificationList: this.props.notificationList,
    })
  }

  renderJobEdit = job => {
    let jobKeys = Object.keys(job.edit)
    return jobKeys.map((jobKey, index) => {
      if (job.edit[jobKey] && jobKey !== 'employee') {
        return (
          <li key={index + jobKey}>
            {jobKey}: {job.edit[jobKey]}
          </li>
        )
      } else return <></>
    })
  }

  renderEmployeeNotificationDetails = jobObj => {
    if (jobObj.status === 'in progress')
      return <span> - You have been added to this job.</span>
    if (jobObj.status === 'submitted')
      return <span> has been submitted for review.</span>
    if (jobObj.status === 'revisions')
      return <span> has been returned for revisions.</span>
    if (jobObj.status === 'completed') return <span> has been completed!</span>
  }

  renderPromoted = () => {
    if (this.props.promoted)
      return (
        <li>
          You have been promoted to Project Manager!{' '}
          <div
            className="JobNotification__close"
            onClick={() => this.props.dismissPromoted()}
          >
            {StyleIcon({ style: 'close' })}
          </div>
        </li>
      )
  }

  renderJobList = () => {
    return this.state.notificationList.map(jobObj => {
      return (
        <li key={jobObj.id} className="notification_job">
          <div className="JobNotification__info">
            <span className="JobNotification__job_link">
              <Link
                to={{
                  pathname: `/project/${jobObj.project_id}`,
                }}
                onClick={() => this.handleClick(jobObj.id, jobObj)}
              >
                {jobObj.name}
              </Link>
            </span>
            {this.context.currentUser.role === 'project worker' &&
              this.renderEmployeeNotificationDetails(jobObj)}
          </div>
          {this.context.currentUser.role === 'project worker' ? (
            <div
              className="JobNotification__close"
              onClick={() => this.handleClick(jobObj.id, jobObj)}
            >
              {StyleIcon({ style: 'close' })}
            </div>
          ) : (
            <></>
          )}

          {this.context.currentUser.role === 'project manager' ? (
            <>
              {jobObj.status === 'submitted' ? (
                <div>
                  <h5>Task Submitted For Approval</h5>
                  <button
                    onClick={e =>
                      this.handleApprovalSubmit(
                        jobObj.id,
                        'completed',
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
                        'revisions',
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
              {jobObj.status === 'edit request' ? (
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
        </li>
      )
    })
  }

  render() {
    if (this.state.error) return null
    else {
      return (
        <div>
          <ul className="JobNotification__list">
            {this.renderPromoted()}
            {this.renderJobList()}
          </ul>
          {this.state.editing ? (
            <JobForm showJobForm={this.openEdit} job={this.state.editJob} />
          ) : (
            <></>
          )}
        </div>
      )
    }
  }
}
