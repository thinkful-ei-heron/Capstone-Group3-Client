import React, { Component } from 'react';
import { ProgressBar } from '../ProgressBar/ProgressBar';

export default class Jobs extends Component {
  static defaultProps = {
    job: {},
    userRole: ''
  }

//props passed down to this component should be structured like below. 
//   job: 
//   {
//     jobId: 1,
//     jobName: 'Rock Faces',
//     jobDetails: 'Sing really well',
//     jobProgress: 50,
//     jobApproval: false,
//     jobRevision: false,
//     jobEmployees: ['Brennan Huff', 'Dr. Doback']
//   }
// ,
// userRole: 'employee'

  state = {
    expandJob: false
  }

  renderEmployeeList = (employees) => {
    return employees.map((employee, index) => {
      let itemKey = index+employee
      return <li key={itemKey}>
        {employee}
      </li>
    })
  }

  renderProjectButtons(approval, progress) {
    if (this.props.userRole === 'employee') {
      if (approval || progress !== 100) {
        return <button disabled>Submit for Approval</button>
      } else {
        return <button>Submit for Approval</button>
      }
    }
    if (this.props.userRole === 'project manager' || this.props.userRole === 'owner') {
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
         <li key={job.jobId} id={job.jobId}>
            <button onClick={this.toggleExpand}>{this.state.expandJob ? '-' : '+'}</button>
            <h4>{job.jobName}</h4>
            <span>{job.jobDetails}</span>
            <div className="job-progress">
              <ProgressBar percentage={job.jobProgress} />
            </div>
            {this.renderProjectButtons(job.jobApproval, job.jobProgress)}
            {this.state.expandJob ? <ul>{this.renderEmployeeList(job.jobEmployees)}</ul> : ''}
          </li>
      </>
    )
  }
}