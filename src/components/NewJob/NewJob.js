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
    let date = deadline
    date.split("-")
    let newDate = date[1] + '/' + date[0] + '/' + date[2]
    const jobObj = {
      approval: false,
      date_created: Date.now(),
      deadline: new Date(newDate).getTime(),
      description: description,
      name: name,
      organization: props.state.companyName,
      progress: 0,
      project_id: props.projectId,
      project_manager: props.state.projectManager,
      project_workers: employees,
      revision: false,
      status: "in progress"
    }
    const promise = new Promise(() => fbContext.addJob(jobObj, props.projectId))
    promise.then(() => props.setJob())
    //fbContext.addJob(jobObj, props.projectId).then(() => props.setJob())
    resetName()
    resetDescription()
    resetDeadline()
    props.showJobForm()
    props.history.push(`/project/${props.projectId}`)
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
            <Dropdown employees={props.state.projectEmployees} path="dash" setSelected={setSelected}/>
            <input type="submit" value="Submit" />
            <button onClick={props.showJobForm}>Cancel</button>
        </fieldset>
      </form>
    </>
  )
}

export default NewJob