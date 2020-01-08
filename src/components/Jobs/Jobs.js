import React, { Component } from 'react';
import { ProgressBar } from '../ProgressBar/ProgressBar';

export default class Jobs extends Component {
  static defaultProps = {
    job: {},
    id: ''
  }

  state = {
    expandJob: false,
    userRole: 'project manager'
  }

  renderEmployeeList = (employees) => {
    return employees.map((employee, index) => {
      let itemKey = index+employee
      return <li key={itemKey}>
        {employee}
      </li>
    })
  }

  //All userRoles will be changed to context!!
  renderProjectButtons(approval, progress) {
    if (this.state.userRole === 'employee') {

      if (approval || progress !== 100) {
        return <button disabled>Submit for Approval</button>
      } else {
        return <button>Submit for Approval</button>
      }
    }
    if (this.state.userRole === 'project manager' || this.state.userRole === 'owner') {
      return <div className="manager__buttons">
        <span>{!approval && progress === 100 ? 'AWAITING APPROVAL' : ''}</span>
        <button>Assign</button>
        <button>Edit</button>
      </div>
    }
  }

  toggleExpand = () => {
    this.setState({
      expandJob: !this.state.expandJob
    })
  }

  render() {
    let job = this.props.job
    return (
      <>
         <li key={this.props.id} id={this.props.id}>
            <button onClick={this.toggleExpand}>{this.state.expandJob ? '-' : '+'}</button>
            <h4>{job.name}</h4>
            <span>{job.description}</span>
            <div className="job-progress">
              <ProgressBar percentage={job.progress} />
            </div>
            {this.renderProjectButtons(job.approval, job.progress)}
            {this.state.expandJob ? <ul>{this.renderEmployeeList(job.employees)}</ul> : ''}

          </li>
      </>
    )
  }
}