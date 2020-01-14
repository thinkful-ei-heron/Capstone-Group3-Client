import React, { useContext, useState } from "react";
import FirebaseContext from "../../services/context";
import JobNotificationList from "./JobNotificationList";

const JobNotification = props => {
  const context = useContext(FirebaseContext);
  const [notificationDropDown, setNotificationDropDown] = useState(false);
  const jobsList = [];

  const grabJobs = () => {
    context.jobs.map(job => {
      if (
        (job.status === "submitted" || job.status === "edit request") &&
        job.project_manager === context.user.name
      ) {
        jobsList.push(job);
      }
    });
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
