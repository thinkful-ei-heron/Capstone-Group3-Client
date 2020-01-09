import React, { Component } from 'react';
import { Input, Label } from '../Form/Form';
import FirebaseContext from '../../services/context';

export default class ProjectForm extends Component {
  static contextType = FirebaseContext;

  handleSubmit = e => {
    e.preventDefault();
    const { name, description, projectManager, deadline } = e.target;
    const data = {
      name: name.value,
      description: description.value,
      project_manager: projectManager.value,
      deadline: deadline.value,
      date_created: new Date(),
      org_id: this.context.user.org.id,
      progress: 0,
      project_workers: [],
    };
    this.context.addProject(data)
    
  };

  render() {
    return (
      <form className="ProjectForm" onSubmit={(e) => this.handleSubmit(e)}>
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
