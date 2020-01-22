import React, { useContext, useState, useEffect } from "react";
import { useInput } from "../../hooks/useInput";
import { Label, Input } from "../Form/Form";
import dbServices from "../../services/dbServices";
import { AuthContext } from "../../services/Auth";
import Swal from "sweetalert2";

const LogHours = props => {
  const { currentUser } = useContext(AuthContext);

  const { value: hours, bind: bindHours, reset: resetHours } = useInput("");
  const { value: job, bind: bindJob, reset: resetJob } = useInput("");
  const [submitted, setSubmitted] = useState(false);

  const populateSelect = () => {
    return props.jobs.map(job => {
      if (job.project_workers.includes(currentUser.name))
        return <option key={job.id}>{job.name}</option>;
      else return null;
    });
  };

  const renderJobHours = () => {
    if (job === "..." || !job) return <></>;
    else {
      let selectedJob = props.jobs.find(item => item.name === job);
      let hoursWorked = selectedJob.hours_completed;
      let hoursNeeded = selectedJob.total_hours;

      return (
        <span>
          This task has {hoursWorked} hours worked out of an estimated{" "}
          {hoursNeeded} hours needed.
        </span>
      );
    }
  };

  const handleJobHoursSubmit = e => {
    e.preventDefault();
    let jobObj = props.jobs.find(item => item.name === job);
    let oldHours = parseInt(jobObj.hours_completed);
    let newHours = oldHours + parseInt(hours);
    jobObj.hours_completed = newHours;

      dbServices
      .editJob(jobObj.id, jobObj)
      .then(setSubmitted(true))
      .then(props.renderLogHoursForm())
      .catch(error => {
        console.warn(error)
        Swal.fire({
          title: "Error!",
          text: 'There was an issue - please refresh the page and try again.',
          icon: 'error',
          confirmButtonText: 'Close'
        })
      })
  };

  useEffect(() => {
    const resetFunction = async () => {
      resetHours();
      resetJob();
    };
    if (submitted)
      return function resetAll() {
        resetFunction();
      };
  });

  return (
    <form onSubmit={e => handleJobHoursSubmit(e)}>
      <Label htmlFor="job_name">
        Select Task:
        <select name="job_name" {...bindJob} required>
          <option>...</option>
          {populateSelect()}
        </select>
      </Label>
      <Label htmlFor="job_hours">
        Number of Hours Worked:
        <Input name="job_hours" type="number" placeholder={0} {...bindHours} />
      </Label>
      <div>{renderJobHours()}</div>
      {job === "..." || job === "" ? (
        <></>
      ) : (
        <button type="submit">Submit Hours</button>
      )}
    </form>
  );
};

export default LogHours;
