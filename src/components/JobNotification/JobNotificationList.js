import React, { useContext } from "react";
import { Link } from "react-router-dom";
import FirebaseContext from "../../services/context";

const JobNotificationList = props => {
  const context = useContext(FirebaseContext);

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
    await context.updateJobStatus(id, status, props.job.project_id, approval);
    await context.updateAndSetJobs(id, status);
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
          >
            {jobObj.name}
          </Link>
          {jobObj.status === "submitted" ? (
            <div>
              <h5>Job Submitted For Approval</h5>
              <button>Approve</button>
              <button>Request Revision</button>
            </div>
          ) : (
            <></>
          )}
          {jobObj.status === "edit request" ? (
            <div>
              <ul>{renderJobEdit(jobObj)}</ul>
              <button
                onClick={e =>
                  handleApprovalSubmit(jobObj.id, "completed", true)
                }
              >
                Submit Edit
              </button>
            </div>
          ) : (
            <></>
          )}
        </li>
      );
    });
  };

  return (
    <div>
      <ul>{renderJobList()}</ul>
    </div>
  );
};

export default JobNotificationList;
