import React, { Component } from "react";
import dbServices from "../../services/dbServices";
import JobNotificationList from "./JobNotificationList";
import OwnerNotification from "./OwnerNotification";

export default class JobNotification extends Component {
  state = {
    notificationCount: 0,
    notificationList: [],
    notificationDropDown: false,
    newEmployees: [],
    completedProjects: [],
    newProjects: []
  };

  getProjects = async () => {
    let projectList = [];
    if (this.props.user.role !== "owner")
      await dbServices.getProjectsByRole(this.props.user).then(snapshot => {
        snapshot.forEach(doc => {
          projectList.push(doc.data());
        });
      });

    return projectList;
  };

  populateNotificationList = async (projectList = null) => {
    if (this.props.user.role === "project manager") {
      let jobsList = [];
      projectList.map(async project => {
        const snapshot = await dbServices.getJobs(project.org_id, project.id);
        snapshot.forEach(doc => {
          if (
            doc.data().status === "submitted" ||
            doc.data().status === "edit request"
          )
            jobsList.push(doc.data());
        });
        this.setState({
          notificationList: jobsList,
          notificationCount: jobsList.length
        });
        return jobsList;
      });
    }
    if (this.props.user.role === "project worker") {
      let jobsList = [];
      projectList.map(async project => {
        const snapshot = await dbServices.getJobs(project.org_id, project.id);
        snapshot.forEach(doc => {
          if (doc.data().alert.includes(this.props.user.name))
            jobsList.push(doc.data());
        });
        this.setState({
          notificationList: jobsList,
          notificationCount: jobsList.length
        });
        return jobsList;
      });
    }
    if (this.props.user.role === "owner") {
      let employees = [];
      let completed = [];
      let newProj = [];
      console.log("employees");
      await dbServices.getEmployees(this.props.user.org).then(snapshot => {
        snapshot.forEach(doc => {
          if (doc.data().new) employees.push(doc.data());
        });
        this.setState({
          newEmployees: employees,
          notificationCount: this.state.notificationCount + employees.length
        });
      });
      console.log("projects");
      await dbServices.getProjectsByRole(this.props.user).then(snapshot => {
        snapshot.forEach(doc => {
          if (doc.data().alert === true && doc.data().completed === true)
            completed.push(doc.data());
          if (doc.data().alert === true && !doc.data().completed)
            newProj.push(doc.data());
        });
        this.setState({
          newProjects: newProj,
          completedProjects: completed,
          notificationCount:
            this.state.notificationCount + newProj.length + completed.length
        });
      });
    }
  };

  async componentDidMount() {
    if (
      this.props.user.role === "project worker" ||
      this.props.user.role === "project manager"
    )
      await this.getProjects().then(projects =>
        this.populateNotificationList(projects)
      );
    else {
      await this.populateNotificationList();
    }
  }

  renderList = e => {
    e.preventDefault();
    this.setState({
      notificationDropDown: !this.state.notificationDropDown
    });
  };

  updateList = jobObj => {
    let newNotifications = this.state.notificationList.filter(
      item => item.id !== jobObj.id
    );
    this.setState({
      notificationList: newNotifications,
      notificationCount: newNotifications.length
    });
  };

  updateNewEmployees = empObj => {
    let updatedNewEmployees = this.state.newEmployees.filter(
      item => item.email !== empObj.email
    );
    this.setState({
      newEmployees: updatedNewEmployees,
      notificationCount: this.state.notificationCount - 1
    });
  };

  render() {
    if (this.props.user.role === "owner")
      return (
        <>
          <button onClick={e => this.renderList(e)}>
            Notifications: {this.state.notificationCount}
          </button>
          {this.state.notificationDropDown ? (
            <OwnerNotification
              newEmployees={this.state.newEmployees}
              completedProjects={this.state.completedProjects}
              newProjects={this.state.newProjects}
              user={this.props.user}
              updateList={this.updateNewEmployees}
            />
          ) : (
            <></>
          )}
        </>
      );
    return (
      <>
        <button onClick={e => this.renderList(e)}>
          Notifications: {this.state.notificationCount}
        </button>
        {this.state.notificationDropDown ? (
          <JobNotificationList
            notificationList={this.state.notificationList}
            user={this.props.user}
            updateList={this.updateList}
          />
        ) : null}
      </>
    );
  }
}
