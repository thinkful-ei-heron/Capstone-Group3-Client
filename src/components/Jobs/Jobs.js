import React, { Component } from 'react';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import FirebaseContext from "../../services/context.js";

export default class Jobs extends Component {
<<<<<<< HEAD
  static defaultProps = {
    job: {}
=======
  constructor(props) {
    super(props);
    this.state = {
      expandJob: false
    }
>>>>>>> origin
  }

  static contextType = FirebaseContext;

<<<<<<< HEAD
  static contextType = FirebaseContext;

  renderEmployeeList = (employees) => {
    return employees.map((employee, index) => {
      let itemKey = index+employee
      return <li key={itemKey}>
        {employee}
      </li>
    })
  }
=======
>>>>>>> origin

  renderEmployeeList = jobWorkers => {
    return jobWorkers.map((employee, index) => {
      let itemKey = index + employee;
      return <li key={itemKey}>{employee}</li>;
    });
  };

  renderProjectButtons(approval, progress) {
    if (this.context.user.role === 'project worker') {
      if (approval || progress !== 100) {
        return <button disabled>Submit for Approval</button>
      } else {
        return <button>Submit for Approval</button>
      }
    }
    if (this.context.user.role === 'project manager' || this.state.userRole === 'owner') {
      return (
        <>
          {!approval && progress === 100 ? <span>AWAITING APPROVAL</span> : ''}
          <button>Assign</button>
          <button>Edit</button>
        </>
      )
    }
  }

  toggleExpand = () => {
    this.setState({
      expandJob: !this.state.expandJob
    })
  }

  componentDidMount() {
    this.setState({
      userRole: this.context.user.role,
    })
  }

  render() {
    console.log('jobs')
    console.log(this.props.job)
    let job = this.props.job
    return (
      <>
<<<<<<< HEAD
         <li key={job.id} id={job.id}>
=======
        <li key={job.id} id={job.id}>
>>>>>>> origin
            <button onClick={this.toggleExpand}>{this.state.expandJob ? '-' : '+'}</button>
            <h4>{job.name}</h4>
            <span>{job.description}</span>
            <div className="job-progress">
              <ProgressBar percentage={job.progress} />
            </div>
            {this.renderProjectButtons(job.approval, job.progress)}
<<<<<<< HEAD
            {this.state.expandJob ? <ul>{this.renderEmployeeList(job.project_workers)}</ul> : ''}

          </li>
=======
            {this.state.expandJob ? <ul>{this.renderEmployeeList(job.job_workers)}</ul> : ''}
        </li>
>>>>>>> origin
      </>
    )
  }
}