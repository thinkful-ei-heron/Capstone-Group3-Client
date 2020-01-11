import React, { useContext, useState } from "react";
import { useInput } from "../../hooks/useInput";
import FirebaseContext from "../../services/context";
import Dropdown from '../Dropdown/Dropdown';

const NewJob = props => {
  const fbContext = useContext(FirebaseContext);
  const [ selected, setSelected ] = useState(0);
  
  const { value: name, bind: bindName, reset: resetName } = useInput("");
  const { value: description, bind: bindDescription, reset: resetDescription } = useInput("");
  const { value: deadline, bind: bindDeadline, reset: resetDeadline } = useInput("");

  const handleSubmit = e => {
    e.preventDefault();
    let employees = []
    selected.map(itm => employees.push(itm.value))
    const jobObj = {
      approval: false,
      date_created: new Date(),
      deadline: new Date(deadline),
      description: description,
      name: name,
      organization: fbContext.user.org.name,
      progress: 0,
      project_id: props.projectId,
      project_manager: props.project.project_manager,
      job_workers: employees,
      revision: false,
      status: "in progress"
    }
    const promise = new Promise(() => fbContext.addJob(jobObj, props.projectId))
    promise.then(() => props.setJob())
    resetName()
    resetDescription()
    resetDeadline()
    props.showJobForm()
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Add New Job</legend>
            <label htmlFor="name">Job Name: </label>
            <input type="text" name="name" id="name" {...bindName} required />
            <label htmlFor="description">Details: </label>
            <textarea name="description" id="description" {...bindDescription} required />
            <label htmlFor="deadline">Deadline: </label>
            <input type="date" name="deadline" id="deadline" {...bindDeadline} required />
            <label htmlFor="employees">Assign employees: </label>
            <Dropdown employees={props.project.project_workers} isMulti={true} setSelected={setSelected}/>
            <input type="submit" value="Submit" />
            <input type="button" value="Cancel" onClick={props.showJobForm} />
        </fieldset>
      </form>
    </>
  )
}

export default NewJob
