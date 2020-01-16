import React from 'react';
import { Input, Label } from '../Form/Form';
import dbServices from '../../services/dbServices';
import * as firebase from 'firebase/app';

const ProjectForm = props => {
  const handleSubmit = async e => {
    e.preventDefault();
    const { name, description, projectManager, deadline } = e.target;
    const data = {
      name: name.value,
      description: description.value,
      project_manager: projectManager.value,
      deadline: firebase.firestore.Timestamp.fromDate(new Date(deadline.value)),
      date_created: new Date(),
      org_id: props.org,
      progress: 0,
      project_workers: [],
      id: null
    };
    const docRef = await dbServices.addProject(data);
    console.log(docRef.id);
    await dbServices.setProjId(docRef.id, data.org_id);
    props.addToProjState({ ...data, id: docRef.id });
    //props.history.push('/dashboard');
  };

  return (
    <form className="ProjectForm" onSubmit={e => handleSubmit(e)}>
      <Label htmlFor="project_name">Name</Label>
      <Input name="name" id="project_name" type="text" placeholder="Project Name" required />
      <Label htmlFor="project_description">Description</Label>
      <Input name="description" id="project_description" type="text" placeholder="Project Description" />
      <Label htmlFor="project_description">Project Manager</Label>
      <Input name="projectManager" id="project_manager" type="text" placeholder="Project Manager" />
      <Label htmlFor="project_deadline">Deadline</Label>
      <input name="deadline" id="project_deadline" type="date" />
      <button type="submit">SUBMIT</button>
      <button onClick={props.toggleNewProj}>CANCEL</button>
    </form>
  );
};

export default ProjectForm;
