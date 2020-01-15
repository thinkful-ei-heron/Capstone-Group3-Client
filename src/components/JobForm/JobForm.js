import React, { useContext, useState, useEffect } from "react";
import { useInput } from "../../hooks/useInput";
import FirebaseContext from "../../services/context";
import Dropdown from "../Dropdown/Dropdown";
import "./JobForm.css";

const JobForm = props => {
  const fbContext = useContext(FirebaseContext);
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const resetFunction = () => {
      resetName();
      resetDescription();
      resetDeadline();
      resetHours();
      props.showJobForm();
    };
    if (submitted)
      return function resetAll() {
        resetFunction();
      };
  });

  const getDate = () => {
    if (props.job) {
      let newDeadline = new Date(props.job.deadline.seconds * 1000);
      return newDeadline.toLocaleDateString("en-CA");
    }
  };

  const getEmployees = () => {
    if (props.job) {
      let workers = [];
      props.job.project_workers.forEach(worker =>
        workers.push({ value: worker, label: worker })
      );
      return workers;
    }
  };

  const { value: name, bind: bindName, reset: resetName } = useInput(
    props.job ? props.job.name : ""
  );
  const {
    value: description,
    bind: bindDescription,
    reset: resetDescription
  } = useInput(props.job ? props.job.description : "");
  const {
    value: deadline,
    bind: bindDeadline,
    reset: resetDeadline
  } = useInput(props.job ? getDate() : "");
  const { value: total_hours, bind: bindHours, reset: resetHours } = useInput(
    props.job ? props.job.total_hours : ""
  );

  const handleSubmit = async e => {
    e.preventDefault();
    let employees = [];
    if (selected) selected.map(itm => employees.push(itm.value));
    let projectId;
    let projectManager;
    let project;
    let id;
    let approval;
    let date_created;
    let hours_completed;
    let status;
    let edit;
    if (props.job) {
      projectId = props.job.project_id;
      projectManager = props.job.project_manager;
      project = fbContext.projects.find(
        project => project.id === props.job.project_id
      );
      id = props.job.id;
      approval = props.job.approval;
      date_created = props.job.date_created;
      hours_completed = props.job.hours_completed;
      if (props.job.status === "edit request") status = "in progress";
      else status = props.job.status;
      edit = null;
    }
    if (props.project) {
      projectId = props.projectId;
      projectManager = props.project.project_manager;
      project = props.project;
      id = null;
      approval = false;
      date_created = new Date();
      hours_completed = 0;
      status = "in progress";
      edit = null;
    }
    const jobObj = {
      approval,
      date_created,
      deadline: new Date(deadline),
      description: description,
      name: name,
      organization: fbContext.user.org,
      total_hours: total_hours,
      hours_completed,
      project_id: projectId,
      project_manager: projectManager,
      project_workers: employees,
      status,
      id,
      edit
    };
    if (props.project) await fbContext.addJob(jobObj, projectId);
    if (props.job) {
      await fbContext.editJob(id, jobObj);
      await fbContext.editAndSetJobs(id, jobObj);
    }
    let updatedProjectWorkers;
    if (props.project) updatedProjectWorkers = props.project.project_workers;
    if (props.job) {
      let project = fbContext.projects.find(
        project => project.id === props.job.project_id
      );
      updatedProjectWorkers = project.project_workers;
    }
    jobObj.project_workers.map(worker => {
      if (!updatedProjectWorkers.includes(worker)) {
        return updatedProjectWorkers.push(worker);
      } else return null;
    });
    await fbContext
      .updateProjectWorkers(projectId, updatedProjectWorkers, project)
      .then(setSubmitted(true));
  };

  const populateEmployeeList = () => {
    let employeeArray = [];
    fbContext.employees.map(employee => employeeArray.push(employee.name));
    return employeeArray;
  };

  let employees = populateEmployeeList();

  return (
    <>
      <form onSubmit={handleSubmit} className="newjob__form">
        <fieldset>
          <legend>{props.projectId ? "Add New Job" : "Edit Job"}</legend>
          <div className="input">
            <label htmlFor="name">Job Name: </label>
            <input type="text" name="name" id="name" {...bindName} required />
          </div>
          <div className="input">
            <label htmlFor="description">Details: </label>
            <textarea
              name="description"
              id="description"
              {...bindDescription}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="total_hours">Total Hours: </label>
            <input
              type="number"
              name="total_hours"
              id="total_hours"
              {...bindHours}
              required
            />
          </div>
          <div className="input">
            <label htmlFor="deadline">Deadline: </label>
            <input
              type="date"
              name="deadline"
              id="deadline"
              {...bindDeadline}
              required
            />
          </div>
          <Dropdown
            employees={employees}
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

export default JobForm;
