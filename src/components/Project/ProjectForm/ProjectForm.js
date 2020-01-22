import React, { useState } from 'react';
import useFormValidation from '../../../hooks/useFormValidation';
import validateInput from '../../../hooks/validateInput';
import { Input, Label, Textarea } from '../../Form/Form';
import dbServices from '../../../services/dbServices';
import dateConversions from '../../../services/dateConversions';
import Dropdown from '../../Dropdown/Dropdown';

const ProjectForm = props => {
  const proj = props.proj;
  const [selected, setSelected] = useState(0);

  const INITIAL_STATE = {
    name: proj ? proj.name : '',
    description: proj ? proj.description : '',
    deadline: proj ? dateConversions.TStoFormDate(props.proj.deadline) : ''
  };

  const handleSubmitForm = async () => {
    const { name, description, deadline } = values;
    let id = null;
    if (props.proj) id = props.proj.id;
    const data = {
      alert: true,
      name: name,
      description: description,
      project_manager: selected.value || 'Unassigned',
      deadline: dateConversions.dateToTimestamp(new Date(deadline)),
      date_created: dateConversions.dateToTimestamp(new Date()),
      org_id: props.org,
      progress: 0,
      project_workers: [],
      id: id
    };

    if (!props.proj) {
      const docRef = await dbServices.addProject(data);
      // console.log(!props.proj);
      await dbServices.setProjId(docRef.id, data.org_id);
      props.addToProjState({ ...data, id: docRef.id });
    } else {
      data.alert = false;
      await dbServices.updateProject(data);
      props.updateProjInState({ ...data });
      props.toggleForm();
    }
    //props.history.push('/dashboard');
  };

  const { handleSubmit, handleChange, handleBlur, values, errors, isSubmitting } = useFormValidation(
    INITIAL_STATE,
    validateInput.validateProjectForm,
    handleSubmitForm
  );

  return (
    <form className="ProjectForm Form" onSubmit={handleSubmit}>
      {errors.name && <span className="error">{errors.name}</span>}
      <Label htmlFor="project_name">Name</Label>
      <Input
        name="name"
        id="project_name"
        type="text"
        placeholder="Project Name"
        onChange={handleChange}
        value={values.name}
        onBlur={handleBlur}
        required
      />
      {errors.description && <span className="error">{errors.description}</span>}
      <Label htmlFor="project_description">Description</Label>
      <Textarea
        name="description"
        id="project_description"
        type="text"
        placeholder="Project Description"
        onChange={handleChange}
        value={values.description}
        onBlur={handleBlur}
      />
      <Label htmlFor="project_description">Project Manager</Label>
      <Dropdown
        pm={true}
        isMulti={false}
        setSelected={setSelected}
        defaultValue={proj && proj.project_manager}
      />
      {errors.deadline && <span className="error">{errors.deadline}</span>}
      <Label htmlFor="project_deadline">Deadline</Label>
      <input
        name="deadline"
        id="project_deadline"
        type="date"
        onChange={handleChange}
        value={values.deadline}
        onBlur={handleBlur}
      />
      <button type="submit">SUBMIT</button>
      <button onClick={props.toggleForm}>CANCEL</button>
    </form>
  );
};

export default ProjectForm;
