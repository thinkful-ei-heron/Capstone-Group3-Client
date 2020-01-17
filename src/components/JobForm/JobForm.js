import React, { useContext, useState, useEffect } from 'react';
import { useInput } from '../../hooks/useInput';
import Dropdown from '../Dropdown/Dropdown';
import { Input, Label, Textarea } from '../Form/Form';
import dbServices from '../../services/dbServices';
import { AuthContext } from '../../services/Auth';
import './JobForm.css';

const NewJob = props => {
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const context = useContext(AuthContext);
  
  useEffect(() => {
    const resetFunction = () => {
      resetName();
      resetDescription();
      resetDeadline();
      resetHours();
    };
    if (submitted)
      return function resetAll() {
        resetFunction();
      };
  });

  const getDate = () => {
    if (props.job) {
      let newDeadline = new Date(props.job.deadline.seconds * 1000);
      return newDeadline.toLocaleDateString('en-CA');
    }
  };

  const getEmployees = () => {
    if (props.job) {
      let workers = [];
      props.job.project_workers.forEach(worker => workers.push({ value: worker, label: worker }));
      return workers;
    }
  };

  const { value: name, bind: bindName, reset: resetName } = useInput(
    props.job ? props.job.name : ''
  );
  const { value: description, bind: bindDescription, reset: resetDescription } = useInput(
    props.job ? props.job.description : ''
  );
  const { value: deadline, bind: bindDeadline, reset: resetDeadline } = useInput(
    props.job ? getDate() : ''
  );
  const { value: total_hours, bind: bindHours, reset: resetHours } = useInput(
    props.job ? props.job.total_hours : ''
  );

  const handleSubmit = async e => {
    e.preventDefault();
    let employees = [];
    if (selected) selected.map(itm => employees.push(itm.value));

    let projectId = props.job ? props.job.project_id : props.projectId;
    let projectManager = props.job ? props.job.project_manager : props.project.project_manager;
    let id = props.job ? props.job.id : null;
    let approval = props.job ? props.job.approval : false;
    let date_created = props.job ? props.job.date_created : new Date();
    let hours_completed = props.job ? props.job.hours_completed : 0;
    let status = 'in progress';
    let edit = null;
    let alert = [];

    if (props.job) {
      if (props.job.status === "edit request") status = "in progress";
      else status = props.job.status;

      employees.map(employee => {
        if (!props.job.project_workers.includes(employee))
          return alert.push(employee);
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
      deadline: new Date(deadline),
      description,
      name,
      organization: context.currentUser.displayName,
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
      await dbServices.getProjectById(props.job.project_id, context.currentUser.displayName)
        .then(project => projects.push(project.data()))
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

    await dbServices.updateProjectWorkers(
      projectId,
      updatedProjectWorkers,
      context.currentUser.displayName
    ).then(props.showJobForm());
  };


  return (
    <>
      <form
        onSubmit={e => handleSubmit(e).then(setSubmitted(true))}
        className="newjob__form"
      >
        <fieldset>
          <legend>{props.projectId ? 'Add New Job' : 'Edit Job'}</legend>
          <div className="input">
            <Label htmlFor="name">Job Name: </Label>
            <Input type="text" name="name" id="name" {...bindName} required /> 
          </div>
          <div className="input">
            <Label htmlFor="description">Details: </Label>
            <Textarea name="description" id="description" {...bindDescription} required />
          </div>
          <div className="input">
            <Label htmlFor="total_hours">Total Hours: </Label>
            <input type="number" name="total_hours" id="total_hours" {...bindHours} required />
          </div>
          <div className="input">
            <Label htmlFor="deadline">Deadline: </Label>
            <input type="date" name="deadline" id="deadline" {...bindDeadline} required />
          </div>
          <Dropdown
            isMulti={true}
            setSelected={setSelected}
            defaultValue={getEmployees()}
            placeholder="Assign Employees"
          />
          <div className="input">
            <input type="button" value="Cancel" onClick={props.showJobForm} />
            <input type="submit" value="Submit" />
          </div>
        </fieldset>
      </form>
    </>
  );
};

export default NewJob;
