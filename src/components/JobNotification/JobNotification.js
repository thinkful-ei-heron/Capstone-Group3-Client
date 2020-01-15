import React, { useContext, useState, useEffect } from "react";
import FirebaseContext from "../../services/context";
import JobNotificationList from "./JobNotificationList";

const JobNotification = props => {
  const context = useContext(FirebaseContext);
  const [notificationDropDown, setNotificationDropDown] = useState(false);
  let jobsList = [];

  const grabJobs = () => {
    if (context.user.role === "project manager") {
      context.jobs.map(job => {
        if (
          (job.status === "submitted" || job.status === "edit request") &&
          job.project_manager === context.user.name
        ) {
          return jobsList.push(job);
        } else return null;
      });
    }
    if (context.user.role === "project worker") {
      context.jobs.map(job => {
        if (job.alert.includes(context.user.name)) return jobsList.push(job);
        else return null;
      });
    }
  };

  const renderList = e => {
    e.preventDefault();
    setNotificationDropDown(!notificationDropDown);
  };

  grabJobs();

  return (
    <div>
      <button onClick={e => renderList(e)}>
        Notifications: {jobsList.length}
      </button>
      <div>
        {notificationDropDown ? (
          <JobNotificationList jobsList={jobsList} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default JobNotification;
