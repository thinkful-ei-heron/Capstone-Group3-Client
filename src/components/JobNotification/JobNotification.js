import React, { Component } from 'react'
import dbServices from '../../services/dbServices'
import JobNotificationList from './JobNotificationList'
import OwnerNotification from './OwnerNotification'
import { AuthContext } from '../../services/Auth'
import Swal from 'sweetalert2'
import './JobNotification.css'
import StyleIcon from '../StyleIcon/StyleIcon'

export default class JobNotification extends Component {
  state = {
    notificationCount: 0,
    notificationList: [],
    notificationDropDown: false,
    newEmployees: [],
    completedProjects: [],
    newProjects: [],
    error: false,
  }

  static contextType = AuthContext

  setError = () => {
    this.setState({
      error: true,
    })
  }

  getProjects = async () => {
    let projectList = []
    if (this.context.currentUser.role !== 'owner')
      try {
        await dbServices
          .getProjectsByRole(this.context.currentUser)
          .then(snapshot => {
            snapshot.forEach(doc => {
              projectList.push(doc.data())
            })
          })
        return projectList
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text:
            'Failed to fetch projects. Notifications are temporarily disabled.',
          icon: 'error',
          confirmButtonText: 'Close',
          onClose: this.setError(),
        })
      }
  }

  populateNotificationList = async (projectList = null) => {
    if (this.context.currentUser.role === 'project manager') {
      let jobsList = []
      projectList.map(async project => {
        let snapshot
        try {
          snapshot = await dbServices.getJobs(project.org_id, project.id)
          snapshot.forEach(doc => {
            if (
              doc.data().status === 'submitted' ||
              doc.data().status === 'edit request'
            )
              jobsList.push(doc.data())
          })
          this.setState({
            notificationList: jobsList,
            notificationCount: jobsList.length,
          })
          return jobsList
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Jobs failed to load. Notifications temporarily disabled.',
            icon: 'error',
            confirmButtonText: 'Close',
            onClose: this.setError(),
          })
        }
      })
    }

    if (this.context.currentUser.role === 'project worker') {
      let jobsList = []
      projectList.map(async project => {
        let snapshot
        try {
          snapshot = await dbServices.getJobs(project.org_id, project.id)
          snapshot.forEach(doc => {
            if (doc.data().alert.includes(this.context.currentUser.name))
              jobsList.push(doc.data())
          })
          this.setState({
            notificationList: jobsList,
            notificationCount: jobsList.length,
          })
          return jobsList
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Jobs failed to load. Notifications temporarily disabled.',
            icon: 'error',
            confirmButtonText: 'Close',
            onClose: this.setError(),
          })
        }
      })
    }

    if (this.context.currentUser.role === 'owner') {
      let employees = []
      let completed = []
      let newProj = []
      try {
        await dbServices
          .getEmployees(this.context.currentUser.org)
          .then(snapshot => {
            snapshot.forEach(doc => {
              if (doc.data().new) employees.push(doc.data())
            })
            this.setState({
              newEmployees: employees,
              notificationCount:
                this.state.notificationCount + employees.length,
            })
          })
        await dbServices
          .getProjectsByRole(this.context.currentUser)
          .then(snapshot => {
            snapshot.forEach(doc => {
              if (doc.data().alert === true && doc.data().date_completed)
                completed.push(doc.data())
              if (doc.data().alert === true && !doc.data().date_completed)
                newProj.push(doc.data())
            })
            this.setState({
              newProjects: newProj,
              completedProjects: completed,
              notificationCount:
                this.state.notificationCount +
                newProj.length +
                completed.length,
            })
          })
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch projects. Notifications temporarily disabled.',
          icon: 'error',
          confirmButtonText: 'Close',
          onClose: this.setError(),
        })
      }

      // console.log("projects");
    }
  }

  async componentDidMount() {
    if (
      this.context.currentUser.role === 'project worker' ||
      this.context.currentUser.role === 'project manager'
    )
      await this.getProjects().then(projects =>
        this.populateNotificationList(projects)
      )
    else {
      await this.populateNotificationList()
    }
  }

  renderList = e => {
    e.preventDefault()
    this.setState({
      notificationDropDown: !this.state.notificationDropDown,
    })
  }

  updateList = jobObj => {
    let newNotifications = this.state.notificationList.filter(
      item => item.id !== jobObj.id
    )
    this.setState({
      notificationList: newNotifications,
      notificationCount: newNotifications.length,
      notificationDropDown: !this.state.notificationDropDown,
    })
  }

  updateNewEmployees = empObj => {
    let updatedNewEmployees = this.state.newEmployees.filter(
      item => item.email !== empObj.email
    )
    this.setState({
      newEmployees: updatedNewEmployees,
      notificationCount: this.state.notificationCount - 1,
    })
  }

  updateProjectList = (projObj, list) => {
    console.log(projObj)
    if (list === 'completed') {
      let updatedCompletedProjects = this.state.completedProjects.filter(
        item => item.id !== projObj.id
      )
      this.setState({
        completedProjects: updatedCompletedProjects,
        notificationCount: this.state.notificationCount - 1,
      })
    } else if (list === 'new') {
      let updatedNewProjects = this.state.newProjects.filter(
        item => item.id !== projObj.id
      )
      console.log(updatedNewProjects)
      this.setState({
        newProjects: updatedNewProjects,
        notificationCount: this.state.notificationCount - 1,
      })
    }
  }

  render() {
    if (this.state.error) return null
    else {
      if (this.context.currentUser.role === 'owner')
        return (
          <>
            {this.state.notificationCount > 0 && (
              <button
                className="JobNotification__btn"
                onClick={e => this.renderList(e)}
              >
                <span className="JobNotification__icon">
                  {this.state.notificationDropDown
                    ? StyleIcon({ style: 'left' })
                    : StyleIcon({ style: 'right' })}
                </span>
                Notifications:
                <span className="JobNotification__number">
                  {this.state.notificationCount}
                </span>
              </button>
            )}
            {this.state.notificationDropDown ? (
              <OwnerNotification
                newEmployees={this.state.newEmployees}
                completedProjects={this.state.completedProjects}
                newProjects={this.state.newProjects}
                user={this.context.currentUser}
                updateList={this.updateNewEmployees}
                updateProjectList={this.updateProjectList}
                renderList={this.renderList}
              />
            ) : (
              <></>
            )}
          </>
        )
      return (
        <>
          {this.state.notificationCount > 0 && (
            <button
              className="JobNotification__btn"
              onClick={e => this.renderList(e)}
            >
              <span className="JobNotification__icon">
                {this.state.notificationDropDown
                  ? StyleIcon({ style: 'left' })
                  : StyleIcon({ style: 'right' })}
              </span>
              Notifications:{' '}
              <span className="JobNotification__number">
                {this.state.notificationCount}
              </span>
            </button>
          )}
          {this.state.notificationDropDown ? (
            <JobNotificationList
              notificationList={this.state.notificationList}
              updateList={this.updateList}
              renderList={this.renderList}
            />
          ) : null}
        </>
      )
    }
  }
}
