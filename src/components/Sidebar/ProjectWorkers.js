import React, { useContext, useEffect } from "react";
import FirebaseContext from "../../services/context";
import { Link } from "react-router-dom";

const ProjectWorkers = props => {
  const context = useContext(FirebaseContext);

  const expanded = props.expanded;

  const toggleExpand = props.toggleExpand;

  let completeWorkerList = [];

  const populateCompleteWorkerList = () => {
    // console.log(context.employees);
    completeWorkerList = [];
    context.employees.map(worker => {
      let projectKeys = [];
      let jobObject = {};
      let newObj = { [worker.name]: [], email: worker.email };
      context.projects.map(project => {
        if (project.project_workers.includes(worker.name)) {
          return projectKeys.push(project.name);
        }
        let jobArray = [];
        context.jobs.map(job => {
          if (
            job.project_id === project.id &&
            job.project_workers &&
            job.project_workers.includes(worker.name)
          )
            return jobArray.push(job.name);
          else return null;
        });
        let tempObj = { [project.name]: jobArray };
        let currObj = jobObject;
        return (jobObject = Object.assign(currObj, tempObj));
      });
      projectKeys.map(project => {
        return newObj[worker.name].push({ [project]: jobObject[project] });
      });
      return completeWorkerList.push(newObj);
    });
  };

  const onLinkClick = name => {
    let project = context.projects.filter(proj => proj.name === name);
    //console.log(project);
    return project[0].id;
  };

  const renderWorkerJobs = jobs => {
    if (jobs.length === 0) return <h5>No Jobs Assigned</h5>;
    return jobs.map((job, index) => {
      //console.log(jobs);
      return <li key={index}>{job}</li>;
    });
  };

  const renderWorkerProjects = worker => {
    //console.log(Object.values(worker));
    return Object.values(worker).map(projects => {
      if (projects.length === 0) return <h4>No Projects Assigned</h4>;
      return projects.map((project, index) => {
        let name = Object.keys(project)[0];
        let jobs = Object.values(project);
        //console.log(name);
        let itemId = "workerProject" + index;
        return (
          <li key={index}>
            <button id={itemId} onClick={e => props.toggleExpand(e)}>
              EXPAND
            </button>
            <Link
              to={{
                pathname: `/project/${onLinkClick(name)}`,
                id: onLinkClick(name),
                toggleExpand: { toggleExpand },
              }}
            >
              {name}
            </Link>
            {expanded.includes(itemId) ? (
              <ul>{renderWorkerJobs(jobs)}</ul>
            ) : (
              <></>
            )}
          </li>
        );
      });
    });
  };

  const handlePromoteUser = async (email, org) => {
    await context.promoteUser(email, org).then(populateCompleteWorkerList());
    // .then(res => populateCompleteWorkerList);
  };

  const renderProjectWorkers = () => {
    return completeWorkerList.map((worker, index) => {
      let itemId = "worker" + index;
      console.log(completeWorkerList[index]);
      return (
        <li key={index}>
          {/* error when I click expand */}
          {/* not sure */}
          {completeWorkerList[index].projects ? (
            <button id={itemId} onClick={e => props.toggleExpand(e)}>
              EXPAND
            </button>
          ) : (
            <p>no jobs assigned</p>
          )}
          {props.promoteButton ? (
            <button
              onClick={() =>
                handlePromoteUser(
                  completeWorkerList[index].email.toLowerCase(),
                  context.user.org,
                )
              }
            >
              Promote
            </button>
          ) : (
            <></>
          )}
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

  useEffect(() => {
    renderProjectWorkers();
  });
  populateCompleteWorkerList();

  return <ul>{renderProjectWorkers()}</ul>;
};

export { ProjectWorkers };
