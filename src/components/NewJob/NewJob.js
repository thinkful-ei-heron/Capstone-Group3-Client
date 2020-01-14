import React, { useContext, useState } from "react";
import { useInput } from "../../hooks/useInput";
import FirebaseContext from "../../services/context";
import Dropdown from "../Dropdown/Dropdown";
import "./NewJob.css";

const NewJob = props => {
  const fbContext = useContext(FirebaseContext);
  const [selected, setSelected] = useState(0);

  const { value: name, bind: bindName, reset: resetName } = useInput("");
  const {
    value: description,
    bind: bindDescription,
    reset: resetDescription
  } = useInput("");
  const {
    value: deadline,
    bind: bindDeadline,
    reset: resetDeadline
  } = useInput("");
  const { value: total_hours, bind: bindHours, reset: resetHours } = useInput(
    ""
  );

  const handleSubmit = async e => {
    e.preventDefault();
    let employees = [];
    if (selected) selected.map(itm => employees.push(itm.value));
    const jobObj = {
      approval: false,
      date_created: new Date(),
      deadline: new Date(deadline),
      description: description,
      name: name,
      organization: fbContext.user.org,
      total_hours: total_hours,
      hours_completed: 0,
      project_id: props.projectId,
      project_manager: props.project.project_manager,
      project_workers: employees,
      revision: false,
      status: "In Progress",
      id: null
    };
    await fbContext.addJob(jobObj, props.projectId);
    let updatedProjectWorkers = props.project.project_workers;
    jobObj.project_workers.map(worker => {
      if (!props.project.project_workers.includes(worker)) {
        return updatedProjectWorkers.push(worker);
      } else return null;
    });
    await fbContext.updateProjectWorkers(
      props.projectId,
      updatedProjectWorkers,
      props.project
    );
    // props.setJob(jobObj);
    resetName();
    resetDescription();
    resetDeadline();
    resetHours();
    props.showJobForm();
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
          <legend>Add New Job</legend>
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
