import React, { useContext, useState } from 'react';
import Dropdown from '../../Dropdown/Dropdown';
import { Input, Label, Textarea } from '../../Form/Form';
import dbServices from '../../../services/dbServices';
import { AuthContext } from '../../../services/Auth';
import useFormValidation from '../../../hooks/useFormValidation';
import validateInput from '../../../hooks/validateInput';
import './JobForm.css';
import dateConversions from '../../../services/dateConversions';

const NewJob = props => {
  const [selected, setSelected] = useState(0);

  const { currentUser } = useContext(AuthContext);

  const getEmployees = () => {
    if (props.job) {
      let workers = [];
      props.job.project_workers.forEach(worker => workers.push({ value: worker, label: worker }));
      return workers;
    }
  };

  const INITIAL_STATE = {
    name: props.job ? props.job.name : '',
    description: props.job ? props.job.description : '',
    deadline: props.job ? dateConversions.TStoFormDate(props.job.deadline) : '',
    total_hours: props.job ? props.job.total_hours : ''
  };

  const handleSubmitForm = async () => {
    const { name, description, total_hours, deadline } = values;
    let employees = [];
    if (selected) selected.map(itm => employees.push(itm.value));

    let projectId = props.job ? props.job.project_id : props.projectId;
    let projectManager = props.job ? props.job.project_manager : props.project.project_manager;
    let id = props.job ? props.job.id : null;
    let approval = props.job ? props.job.approval : false;
    let date_created = props.job ? props.job.date_created : dateConversions.dateToTimestamp(new Date());
    let hours_completed = props.job ? props.job.hours_completed : 0;
    let status = 'in progress';
    let edit = null;
    let alert = [];

    if (props.job) {
      if (props.job.status === 'edit request') status = 'in progress';
      else status = props.job.status;

      employees.map(employee => {
        if (!props.job.project_workers.includes(employee)) return alert.push(employee);
        else return null;
      });
    } else {
      employees.map(employee => {
        return alert.push(employee);
      });
    }

    const jobObj = {
      approval,
      date_created,
      deadline: dateConversions.dateToTimestamp(new Date(deadline)),
      description,
      name,
      organization: currentUser.org,
      total_hours,
      hours_completed,
      project_id: projectId,
      project_manager: projectManager,
      project_workers: employees,
      status,
      id,
      edit,
      alert
    };

    if (props.job) {
      await dbServices.editJob(id, jobObj);
    } else {
      await dbServices.addJob(jobObj, projectId);
    }

    let updatedProjectWorkers = null;

    if (props.job) {
      let projects = [];
      await dbServices
        .getProjectById(props.job.project_id, currentUser.org)
        .then(project => projects.push(project.data()));
      let project = projects[0];
      updatedProjectWorkers = project.project_workers;
    } else {
      updatedProjectWorkers = props.project.project_workers;
    }

    jobObj.project_workers.map(worker => {
      if (!updatedProjectWorkers.includes(worker)) {
        return updatedProjectWorkers.push(worker);
      } else return null;
    });

    await dbServices.updateProjectWorkers(projectId, updatedProjectWorkers, currentUser.org).then(() => {
      props.showJobForm();
    });
  };

  const { handleSubmit, handleChange, handleBlur, values, errors, isSubmitting } = useFormValidation(
    INITIAL_STATE,
    validateInput.validateJobForm,
    handleSubmitForm
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="Form">
        <fieldset>
          <legend>{props.projectId ? 'Add New Task' : 'Edit Task'}</legend>
          <div className="input">
            <Label htmlFor="name">Task Name: </Label>
            <Input
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              value={values.name}
              onBlur={handleBlur}
            />
            {errors.name && <p>*{errors.name}</p>}
          </div>
          <div className="input">
            <Label htmlFor="description">Details: </Label>
            <Textarea
              name="description"
              id="description"
              onChange={handleChange}
              value={values.description}
              onBlur={handleBlur}
            />
            {errors.description && <p>*{errors.description}</p>}
          </div>
          <div className="input">
            <Label htmlFor="total_hours">Total Hours: </Label>
            <input
              type="number"
              name="total_hours"
              id="total_hours"
              onChange={handleChange}
              value={values.total_hours}
              onBlur={handleBlur}
            />
            {errors.total_hours && <p>*{errors.total_hours}</p>}
          </div>
          <div className="input">
            <Label htmlFor="deadline">Deadline: </Label>
            <input
              type="date"
              name="deadline"
              id="deadline"
              onChange={handleChange}
              value={values.deadline}
              onBlur={handleBlur}
            />
            {errors.deadline && <p>*{errors.deadline}</p>}
          </div>
          <Dropdown
            isMulti={true}
            setSelected={setSelected}
            defaultValue={getEmployees()}
            placeholder="Assign Employees"
          />
          <div className="input">
            <input type="button" value="Cancel" onClick={props.showJobForm} />
            <input type="submit" disabled={isSubmitting} value="Submit" />
          </div>
        </fieldset>
      </form>
    </>
  );
};

export default NewJob;
