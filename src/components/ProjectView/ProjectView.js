import React, { Component } from 'react'
import Firebase from '../../services/index.js'
import FirebaseContext from '../../services/context.js'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import './ProjectView.css'
import Loading from '../Loading/Loading'
import Jobs from '../Jobs/Jobs'
import ProjectManagerSelector from '../ProjectManagerSelector/ProjectManagerSelector'
import Statistics from '../Statistics/Statistics'
import Sidebar from '../Sidebar/Sidebar'

export default class ProjectView extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      jobs:[{
        id: 1,
        details: {
          name: 'Rock Faces',
          details: 'Sing really well',
          progress: 50,
          approval: false,
          revision: false,
          employees: ['Brennan Huff', 'Dr. Doback']
        }
      },
      {
        id: 2,
        details: {
          name: 'Practice Family Singing',
          details: 'Do NOT Be Flat!',
          progress: 100,
          approval: false,
          revision: false,
          employees: ['Brennan Huff', 'Derek Huff', 'Alice Huff']
        }
      }
    ],
      userName: 'Brennan Huff', //pass in through props or context
      userRole: 'employee',
      companyName: 'EI35 - Group 3', //pass in through props or context
      date: new Date().toDateString(),
      projectName: 'Catalina Wine Mixer',
      projectDescription: 'Biggest Helicopter Rental Event in all of SoCal',
      projectProgress: 67,
      projectDeadline: '2/18/2020',
      projectManager: 'Dale Doback',
      projectJobs: [{
        jobName: 'Rock Faces',
        jobDetails: 'Sing really well',
        jobProgress: 50,
        jobApproval: false,
        jobRevision: false,
        jobEmployees: ['Brennan Huff', 'Dr. Doback']
      }, {
        jobName: 'Practice Family Singing',
        jobDetails: 'Do NOT Be Flat!',
        jobProgress: 100,
        jobApproval: false,
        jobRevision: false,
        jobEmployees: ['Brennan Huff', 'Derek Huff', 'Alice Huff']
      }],
      loading: true
    }
  }

  static contextType = FirebaseContext

  renderEmployeeList = (employees) => {
    return employees.map((employee, index) => {
      let itemKey = index+employee
      return <li key={itemKey}>
        {employee}
      </li>
    })
  }

  renderJobList = () => {
    return this.state.projectJobs.map((job, index) => {
      return <li key={index} id={index}>
        <button>^</button>
        <h4>{job.jobName}</h4>
        <span>{job.jobDetails}</span>
        <div className='job-progress'>
          <ProgressBar percentage={job.jobProgress} />
        </div>
        {job.jobApproval || job.jobProgress !== 100 ?
          <button disabled>Submit For Approval</button> :
          <button>Submit For Approval</button>}
        <ul>
          {this.renderEmployeeList(job.jobEmployees)}
        </ul>
      </li>
    })
  }
 
  componentDidMount() {

    this.context.doGetProject()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if(doc.data().name === 'Project Management App'){//Pass in prop of Project Name to grab correct data
            let newProjectName = doc.data().name
            let newProjetDescription = doc.data().description
            let newProjectDeadline = new Date(doc.data().deadline.seconds * 1000).toDateString()
            let newProjectManager = doc.data().project_manager
            let newProjectProgress = doc.data().progress
            this.setState({
              projectName: newProjectName,
              projectDescription: newProjetDescription,
              projectDeadline: newProjectDeadline,
              projectManager: newProjectManager,
              projectProgress: newProjectProgress,
              loading: false
            })
          }  
        })
      })
  }

  render() {
    if(this.state.loading) {
      return <Loading />
    } else {
      return (
      <div>
        <header id='employee-view-header-company'>
          <h2 id='companyName'>{this.state.companyName}</h2>
          <span id=''>{this.state.date}</span>
        </header>
        <div>
          <header id='employee-view-project-header'>
            <div id='project-name-manager'>
              <h3 id='projectName'>{this.state.projectName}</h3>
              <h4 id='projectManager'>Manager: {this.state.projectManager}</h4>
            </div>
            <div id='projectDescription'>{this.state.projectDescription}</div>
            <div>Est. Progress</div>
            <ProgressBar percentage={this.state.projectProgress}/>
            <div id='projectDeadline'>Deadline: {this.state.projectDeadline}</div>
            {this.state.userRole === 'employee' ? <></> : <ProjectManagerSelector />} 
          </header>
        </div>
        <div id='employee-view-jobs'>
          {this.state.userRole === 'employee' ? <></> : <Statistics />}
          <h3>Your Jobs</h3>
          {/* <ul>{this.renderJobList()}</ul> */}
          <ul>{this.state.jobs &&
               this.state.jobs.map(job => {
                //  console.log(job.data())
                  return <Jobs key={job.id} id={job.id} job={job.details}/>
               })}
          </ul>
        </div>
        <Sidebar view='project'/>
      </div>
    )
    }
    
  }
}