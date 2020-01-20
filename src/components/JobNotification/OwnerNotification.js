import React, { Component } from "react";
import { Link } from "react-router-dom";
import dbServices from "../../services/dbServices";

export default class OwnerNotification extends Component {
  state = {
    newEmployees: null,
    newProjects: null,
    completedProjects: null
  };

  handleNewEmployee = async (e, employee) => {
    e.preventDefault();
    employee.new = false;
    await dbServices.updateWorker(employee, this.props.user.org);
    this.props.updateList(employee);
    this.setState({
      newEmployees: this.props.newEmployees
    });
  };

  handleClick = async project => {
    project.alert = false;
    await dbServices.updateProject(project);
    console.log(project);
  };

  renderNewEmployees = () => {
    if (this.props.newEmployees.length > 0) {
      return this.props.newEmployees.map((employee, index) => {
        return (
          <li key={index + employee}>
            {employee.name} has joined your organization!
            <button onClick={e => this.handleNewEmployee(e, employee)}>
              Cool.
            </button>
          </li>
        );
      });
    }
  };

  renderNewProjects = () => {
    if (this.props.newProjects.length > 0) {
      return this.props.newProjects.map(project => {
        return (
          <li key={project.id}>
            <Link
              onClick={() => this.handleClick(project)}
              to={{ pathname: `/project/${project.id}` }}
            >
              {project.name} has started.
            </Link>
          </li>
        );
      });
    }
  };

  renderCompletedProjects = () => {
    if (this.props.completedProjects.length > 0) {
      return this.props.completedProjects.map(project => {
        return (
          <li key={project.id}>
            <Link
              onClick={() => this.handleClick(project)}
              to={{ pathname: `/project/${project.id}` }}
            >
              {project.name} has been completed!
            </Link>
          </li>
        );
      });
    }
  };

  componentDidMount() {
    this.setState({
      newEmployees: this.props.newEmployees,
      newProjects: this.props.newProjects,
      completedProjects: this.props.completedProjects
    });
  }

  render() {
    return (
      <div>
        <ul>
          {this.renderNewEmployees()}
          {this.renderNewProjects()}
          {this.renderCompletedProjects()}
        </ul>
      </div>
    );
  }
}
