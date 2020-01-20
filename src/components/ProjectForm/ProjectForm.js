import React from 'react';
import { Input, Label } from '../Form/Form';
import dbServices from '../../services/dbServices';
import dateConversions from '../../services/dateConversions';

const ProjectForm = props => {
  const handleSubmit = async e => {
    e.preventDefault();
    const { name, description, projectManager, deadline } = e.target;
    let id = null;
    if (props.proj) id = props.proj.id;
    const data = {
      name: name.value,
      description: description.value,
      project_manager: projectManager.value,
      deadline: dateConversions.dateToTimestamp(new Date(deadline.value)),
      date_created: new Date(),
      org_id: props.org,
      progress: 0,
      project_workers: [],
      id: null,
      alert: true
    };

    if (!props.proj) {
      const docRef = await dbServices.addProject(data);
      // console.log(!props.proj);
      await dbServices.setProjId(docRef.id, data.org_id);
      props.addToProjState({ ...data, id: docRef.id });
    } else {
      await dbServices.updateProject(data);
      props.updateProjInState({ ...data });
      props.toggleForm();
    }
    //props.history.push('/dashboard');
  };

  // console.log(props.proj);

  return (
    <form className="ProjectForm" onSubmit={e => handleSubmit(e)}>
      <Label htmlFor="project_name">Name</Label>
      <Input
        name="name"
        id="project_name"
        type="text"
        placeholder="Project Name"
        defaultValue={props.proj ? props.proj.name : ''}
        required
      />
      <Label htmlFor="project_description">Description</Label>
      <Input
        name="description"
        id="project_description"
        type="text"
        placeholder="Project Description"
        defaultValue={props.proj ? props.proj.description : ''}
      />
      <Label htmlFor="project_description">Project Manager</Label>
      <Input
        name="projectManager"
        id="project_manager"
        type="text"
        placeholder="Project Manager"
        defaultValue={props.proj ? props.proj.project_manager : ''}
      />
      <Label htmlFor="project_deadline">Deadline</Label>
      <input
        name="deadline"
        id="project_deadline"
        type="date"
        defaultValue={
          props.proj ? dateConversions.TStoFormDate(props.proj.deadline) : ''
        }
      />
      <button type="submit">SUBMIT</button>
      <button onClick={props.toggleForm}>CANCEL</button>
    </form>
  );
};

export default ProjectForm;
