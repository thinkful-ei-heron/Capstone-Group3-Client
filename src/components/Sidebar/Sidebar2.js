import React, { useContext, useState } from "react";
import FirebaseContext from "../../services/context";

const Sidebar = props => {
  const context = useContext(FirebaseContext);

  let [expanded, setExpanded] = useState([]);

  const projectManagerList = context.employees.filter(
    employee => employee.role !== "project worker" && employee.role !== "admin"
  );
  const projectWorkerList = context.employees.filter(
    employee => employee.role !== "project manager" && employee.role !== "admin"
  );

  let completeManagerList = [];
  let completeWorkerList = [];

  const populateCompleteManagerList = () => {
    projectManagerList.map(manager => {
      let projectArray = [];
      context.projects.map(project => {
        if (project.project_manager === manager.name)
          return projectArray.push(project.name);
        else return;
      });
      return completeManagerList.push({ [manager.name]: projectArray });
    });
  };

  const populateCompleteWorkerList = () => {
    completeWorkerList = [];
    projectWorkerList.map(worker => {
      let projectKeys = [];
      let jobObject = {};
      let newObj = { [worker.name]: [] };
      context.projects.map(project => {
        if (project.project_workers.includes(worker.name)) {
          projectKeys.push(project.name);
        }
        let jobArray = [];
        context.jobs.map(job => {
          if (
            job.project_id === project.id &&
            job.project_workers.includes(worker.name)
          )
            jobArray.push(job.name);
        });
        let tempObj = { [project.name]: jobArray };
        let currObj = jobObject;
        jobObject = Object.assign(currObj, tempObj);
      });
      projectKeys.map(project => {
        newObj[worker.name].push({ [project]: jobObject[project] });
      });
      completeWorkerList.push(newObj);
    });
  };

  const toggleExpand = e => {
    let newExpanded = [];
    if (!expanded.includes(e.target.id)) {
      newExpanded = expanded;
      newExpanded.push(e.target.id);
    } else {
      newExpanded = expanded.filter(id => id !== e.target.id);
    }
    return setExpanded(newExpanded);
  };

  const renderPMProjects = name => {
    let projectNames = Object.values(name);
    if (projectNames[0].length === 0) return <h4>No Project Assigned</h4>;
    else {
      return projectNames[0].map((name, index) => {
        return <li key={index}>{name}</li>;
      });
    }
  };

  const renderProjectManagers = () => {
    console.log(expanded);
    if (completeManagerList.length === 0) return <></>;
    return completeManagerList.map((manager, index) => {
      let itemId = "manager" + index;
      return (
        <li key={index}>
          <button id={itemId} onClick={e => toggleExpand(e)}>
            EXPAND
          </button>
          <h4>{Object.keys(manager)[0]}</h4>
          {expanded.includes(itemId) ? (
            <ul>{renderPMProjects(manager)}</ul>
          ) : (
            <></>
          )}
        </li>
      );
    });
  };

  const renderWorkerProjects = worker => {
    console.log(worker);
  };

  const renderProjectWorkers = () => {
    return completeWorkerList.map((worker, index) => {
      let itemId = "worker" + index;
      return (
        <li key={index}>
          <button id={itemId} onClick={e => toggleExpand(e)}>
            EXPAND
          </button>
          <h4>{Object.keys(worker)[0]}</h4>
          {expanded.includes(itemId) ? (
            <ul>{renderWorkerProjects(worker)}</ul>
          ) : (
            <></>
          )}
        </li>
      );
    });
  };
  populateCompleteManagerList();
  populateCompleteWorkerList();
  console.log(completeWorkerList);

  if (context.user.role === "project worker") {
    return <></>;
  }

  if (context.user.role === "project manager") {
    return (
      <>
        <h2>Employees</h2>
        <ul>{renderProjectWorkers()}</ul>
      </>
    );
  }

  if (context.user.role === "admin") {
    //change to admin
    return (
      <>
        <h2>PROJECT MANAGERS</h2>
        <ul>{renderProjectManagers()}</ul>
      </>
    );
  }
};

export { Sidebar };
