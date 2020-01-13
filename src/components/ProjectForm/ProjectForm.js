import React, { Component } from 'react';
import { Input, Label } from '../Form/Form';
import FirebaseContext from '../../services/context';
import * as firebase from 'firebase/app';

export default class ProjectForm extends Component {
  static contextType = FirebaseContext;

  handleSubmit = async e => {
    e.preventDefault();
    //console.log(this.context.user);
    const { name, description, projectManager, deadline } = e.target;
    const data = {
      name: name.value,
      description: description.value,
      project_manager: projectManager.value,
      deadline: firebase.firestore.Timestamp.fromDate(new Date(deadline.value)),
      date_created: new Date(),
      org_id: this.context.user.org,
      progress: 0,
      project_workers: []
    };
    await this.context.addProject(data);
    this.props.history.push('/dashboard');
  };

  render() {
    return (
      <form className="ProjectForm" onSubmit={e => this.handleSubmit(e)}>
        <Label htmlFor="project_name">Name</Label>
        <Input name="name" id="project_name" type="text" placeholder="Project Name" required />
        <Label htmlFor="project_description">Description</Label>
        <Input name="description" id="project_description" type="text" placeholder="Project Description" />
        <Label htmlFor="project_description">Project Manager</Label>
        <Input name="projectManager" id="project_manager" type="text" placeholder="Project Manager" />
        <Label htmlFor="project_deadline">Deadline</Label>
        <input name="deadline" id="project_deadline" type="date" />
        <button type="submit">SUBMIT</button>
      </form>
    );
  }
}
