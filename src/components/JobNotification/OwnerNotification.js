import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import dbServices from '../../services/dbServices';
import { AuthContext } from '../../services/Auth';
import StyleIcon from '../StyleIcon/StyleIcon';
import Swal from 'sweetalert2';

export default class OwnerNotification extends Component {
  state = {
    newEmployees: null,
    newProjects: null,
    completedProjects: null,
  };

  static contextType = AuthContext;

  handleNewEmployee = async (employee, e) => {
    try {
      employee.new = false;
      await dbServices.updateWorker(employee, this.context.currentUser.org);
      this.props.updateList(employee, e);
      this.setState({
        newEmployees: this.props.newEmployees,
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Employee status failed to update.',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    }
  };

  handleClick = async (project, type, e) => {
    e.stopPropagation();
    project.alert = false;
    await dbServices
      .updateProject(project)
      .then(this.props.updateProjectList(project, type))
      .then(this.props.renderList(e));
  };

  renderNewEmployees = () => {
    if (this.props.newEmployees.length > 0) {
      return this.props.newEmployees.map((employee, index) => {
        return (
          <li key={index + employee}>
            <Link
              to={`/profile/${employee.email}`}
              onClick={e => this.handleNewEmployee(employee, e)}
            >
              {employee.name} has joined your organization!
            </Link>
            <div
              className="JobNotification__close"
              onClick={() => this.handleNewEmployee(employee)}
            >
              {StyleIcon({ style: 'close' })}
            </div>
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
              onClick={e => this.handleClick(project, 'new', e)}
              to={{ pathname: `/project/${project.id}` }}
            >
              {project.name} has started.
            </Link>
            <div
              className="JobNotification__close"
              onClick={e => this.handleClick(project, 'new', e)}
            >
              {StyleIcon({ style: 'close' })}
            </div>
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
              onClick={e => this.handleClick(project, 'completed', e)}
              to={{ pathname: `/project/${project.id}` }}
            >
              {project.name} has been completed!
            </Link>
            <div
              className="JobNotification__close"
              onClick={e => this.handleClick(project, 'completed', e)}
            >
              {StyleIcon({ style: 'close' })}
            </div>
          </li>
        );
      });
    }
  };

  componentDidMount() {
    this.setState({
      newEmployees: this.props.newEmployees,
      newProjects: this.props.newProjects,
      completedProjects: this.props.completedProjects,
    });
  }

  render() {
    return (
      <div>
        <ul className="JobNotification__list">
          {this.renderNewEmployees()}
          {this.renderNewProjects()}
          {this.renderCompletedProjects()}
        </ul>
      </div>
    );
  }
}
