import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import FirebaseContext from "../../services/context";
import JobForm from "../JobForm/JobForm";

//For project worker, figure out how to display WHY something is in notifications
//Create a button that will remove them from alert array once clicked
//Reasons for notification: Added to job, Job Completed, Job sent back for revisions
const JobNotificationList = props => {
  const context = useContext(FirebaseContext);

  const [editing, setEditing] = useState(false);
  const [editJob, setEditJob] = useState({});

  const renderJobEdit = job => {
    let jobKeys = Object.keys(job.edit);
    return jobKeys.map((jobKey, index) => {
      if (job.edit[jobKey] && jobKey !== "employee") {
        return (
          <li key={index + jobKey}>
            {jobKey}: {job.edit[jobKey]}
          </li>
        );
      } else return <></>;
    });
  };

  const handleApprovalSubmit = async (id, status, approval = false) => {
    console.log(id);
    let jobData = context.jobs.find(item => item.id === id);
    let projectId = jobData.project_id;
    await context.updateJobStatus(id, status, projectId, approval);
    await context.updateAndSetJobs(id, status);
  };

  const openEdit = (e, jobObj) => {
    e.preventDefault();
    setEditing(!editing);
    setEditJob(jobObj);
  };

  const renderEmployeeNotificationDetails = jobObj => {
    if (jobObj.status === "in progress")
      return <span>You have been added to {jobObj.name}.</span>;
    if (jobObj.status === "submitted")
      return <span>{jobObj.name} has been submitted for review.</span>;
    if (jobObj.status === "revisions")
      return <span>{jobObj.name} has been returned for revisions.</span>;
    if (jobObj.status === "completed")
      return <span>{jobObj.name} has been completed!</span>;
  };

  const handleClick = async (id, jobObj) => {
    if (
      context.user.role === "project manager" ||
      context.user.role === "owner"
    )
      return null;
    else {
      let newAlert = jobObj.alert.filter(name => name !== context.user.name);
      jobObj.alert = newAlert;
      await context.editJob(id, jobObj);
      await context.editAndSetJobs(id, jobObj);
    }
  };

  const renderJobList = () => {
    return props.jobsList.map((jobObj, index) => {
      console.log(jobObj.id);
      return (
        <li key={jobObj.id} className="notification_job">
          <Link
            to={{
              pathname: `/project/${jobObj.project_id}`
            }}
            onClick={() => handleClick(jobObj.id, jobObj)}
          >
            {jobObj.name}
          </Link>
          {context.user.role === "project manager" ? (
            <>
              {jobObj.status === "submitted" ? (
                <div>
                  <h5>Job Submitted For Approval</h5>
                  <button
                    onClick={e =>
                      handleApprovalSubmit(jobObj.id, "completed", true)
                    }
                  >
                    Approve
                  </button>
                  <button
                    onClick={e => handleApprovalSubmit(jobObj.id, "revisions")}
                  >
                    Request Revision
                  </button>
                </div>
              ) : (
                <></>
              )}
              {jobObj.status === "edit request" ? (
                <div>
                  <ul>{renderJobEdit(jobObj)}</ul>
                  <button onClick={e => openEdit(e, jobObj)}>
                    Submit Edit
                  </button>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          {context.user.role === "project worker" ? (
            <p>{renderEmployeeNotificationDetails(jobObj)}</p>
          ) : (
            <></>
          )}
        </li>
      );
    });
  };
  // if (context.user.role === "project manager") {
  return (
    <div>
      <ul>{renderJobList()}</ul>
      {editing ? <JobForm showJobForm={openEdit} job={editJob} /> : <></>}
    </div>
  );
  // }
  // if (context.user.role === "project worker") {
  //   return (
  //     <div>
  //       <h2>Hello Worker</h2>
  //     </div>
  //   );
  // }
};

export default JobNotificationList;
