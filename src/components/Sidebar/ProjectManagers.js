import React, { useContext, useEffect } from 'react';
//import FirebaseContext from "../../services/context";
import { Link } from 'react-router-dom';

const ProjectManagers = props => {
  //const context = useContext(FirebaseContext);

  const expanded = props.expanded;

  let completeManagerList = [];

  const populateCompleteManagerList = () => {
    /*
    context.project_managers.map(manager => {
      let projectArray = [];
      context.projects.map(project => {
        if (project.project_manager === manager.name) return projectArray.push(project.name);
        else return null;
      });
      return completeManagerList.push({ [manager.name]: projectArray });
    });
    */
  };

  const onLinkClick = name => {
    //let project = context.projects.filter(proj => proj.name === name);
    //return project[0].id;
  };

  const renderPMProjects = name => {
    let projectNames = Object.values(name);
    if (projectNames[0].length === 0) return <h4>No Project Assigned</h4>;
    else {
      return projectNames[0].map((name, index) => {
        return (
          <li key={index}>
            <Link to={`/project/${onLinkClick(name)}`}>{name}</Link>
          </li>
        );
      });
    }
  };

  const renderProjectManagers = () => {
    if (completeManagerList.length === 0) return <></>;
    return completeManagerList.map((manager, index) => {
      let itemId = 'manager' + index;
      return (
        <li key={index}>
          <button id={itemId} onClick={e => props.toggleExpand(e)}>
            EXPAND
          </button>
          <h4>{Object.keys(manager)[0]}</h4>
          {expanded.includes(itemId) ? <ul>{renderPMProjects(manager)}</ul> : <></>}
        </li>
      );
    });
  };

  useEffect(() => {
    renderProjectManagers();
  });

  populateCompleteManagerList();

  return <ul>{renderProjectManagers()}</ul>;
};

export { ProjectManagers };
