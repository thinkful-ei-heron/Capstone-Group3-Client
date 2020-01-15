import React, { useContext, useState, useEffect } from "react";
import FirebaseContext from "../../services/context";
import JobNotificationList from "./JobNotificationList";
import OwnerNotification from "./OwnerNotification";

const JobNotification = props => {
  const context = useContext(FirebaseContext);
  const [notificationDropDown, setNotificationDropDown] = useState(false);
  let jobsList = [];
  let ownerList = { newEmployees: [], completedProjects: [], newProjects: [] };
  let ownerListCount = 0;
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
    //new project created, new user, project completed
    if (context.user.role === "owner") {
      context.employees.map(employee => {
        if (employee.new) {
          ownerListCount++;
          return ownerList.newEmployees.push({
            name: employee.name,
            id: employee.email
          });
        } else return null;
      });
      context.projects.map(project => {
        if (project.alert === true && project.completed !== true) {
          ownerListCount++;
          return ownerList.newProjects.push(project);
        }

        if (project.alert === true && project.completed === true) {
          ownerListCount++;
          return ownerList.completedProjects.push(project);
        } else return null;
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
      {context.user.role === "owner" ? (
        <button onClick={e => renderList(e)}>
          Notifications: {ownerListCount}
        </button>
      ) : (
        <button onClick={e => renderList(e)}>
          Notifications: {jobsList.length}
        </button>
      )}

      <div>
        {notificationDropDown &&
        (context.user.role === "project manager" ||
          context.user.role === "project worker") ? (
          <JobNotificationList jobsList={jobsList} />
        ) : (
          <></>
        )}
        {notificationDropDown && context.user.role === "owner" ? (
          <OwnerNotification ownerList={ownerList} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default JobNotification;
