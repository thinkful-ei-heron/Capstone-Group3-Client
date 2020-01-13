import React, { useContext, useEffect } from 'react';
import FirebaseContext from '../../services/context';
import { Link } from 'react-router-dom';

const ProjectWorkers = props => {
  const context = useContext(FirebaseContext);

  const expanded = props.expanded;

  const toggleExpand = props.toggleExpand;

  let completeWorkerList = [];

  const populateCompleteWorkerList = () => {
    completeWorkerList = [];
    context.employees.map(worker => {
      let projectKeys = [];
      let jobObject = {};
      let newObj = { [worker.name]: [] };
      context.projects.map(project => {
        if (project.project_workers.includes(worker.name)) {
          projectKeys.push(project.name);
        }
        let jobArray = [];
        console.log(context.jobs);
        context.jobs.map(job => {
          if (
            job.project_id === project.id &&
            job.project_workers &&
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

  const onLinkClick = name => {
    let project = context.projects.filter(proj => proj.name === name);
    console.log(project);
    return project[0].id;
  };

  const renderWorkerJobs = jobs => {
    if (jobs[0].length === 0) return <h5>No Jobs Assigned</h5>;
    return jobs.map((job, index) => {
      console.log(jobs);
      return <li key={index}>{job}</li>;
    });
  };

  const renderWorkerProjects = worker => {
    console.log(Object.values(worker));
    return Object.values(worker).map(projects => {
      if (projects.length === 0) return <h4>No Projects Assigned</h4>;
      return projects.map((project, index) => {
        let name = Object.keys(project)[0];
        let jobs = Object.values(project);
        console.log(name);
        let itemId = 'workerProject' + index;
        return (
          <li key={index}>
            <button id={itemId} onClick={e => props.toggleExpand(e)}>
              EXPAND
            </button>
            <Link
              to={{
                pathname: `/project/${onLinkClick(name)}`,
                id: onLinkClick(name),
                toggleExpand: { toggleExpand }
              }}
            >
              {name}
            </Link>
            {expanded.includes(itemId) ? <ul>{renderWorkerJobs(jobs)}</ul> : <></>}
          </li>
        );
      });
    });
  };

  const renderProjectWorkers = () => {
    return completeWorkerList.map((worker, index) => {
      let itemId = 'worker' + index;
      return (
        <li key={index}>
          <button id={itemId} onClick={e => props.toggleExpand(e)}>
            EXPAND
          </button>
          <h4>{Object.keys(worker)[0]}</h4>
          {expanded.includes(itemId) ? <ul>{renderWorkerProjects(worker)}</ul> : <></>}
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
