import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import dbServices from '../../services/dbServices';
import dateConversions from '../../services/dateConversions';
import Dropdown from '../Dropdown/Dropdown';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import ProjectForm from '../ProjectForm/ProjectForm';
import './ProjectBar.css';

const ProjectBar = props => {
  const [selectedProjectManager, setSelectedProjectManager] = useState(null);
  const [assign, setAssign] = useState(false);
  const [edit, setEdit] = useState(false);

  const db = dbServices;

  const setSelected = employee => {
    setSelectedProjectManager(employee);
  };

  const setProjectManager = async () => {
    await db.setProjectsManager(props.proj.id, props.proj.org_id, selectedProjectManager.value);
    props.updatePM(props.proj.id, selectedProjectManager.value);
    toggleAssign();
  };

  const toggleAssign = () => {
    setAssign(!assign);
  };

  const toggleEdit = () => {
    setEdit(!edit);
  };

  const renderPmList = () => {
    let result = [];
    props.projectManagers.forEach(pm => result.push(pm.name));
    return result;
  };

  return (
    <ul className="ProjectBar__project_container">
      <Link className="ProjectBar__link_wrapper" to={`/project/${props.proj.id}`} key={props.proj.id}>
        <li className="ProjectBar__header">
          <span className="ProjectBar__proj_name">{props.proj.name}</span>
          <span className="ProjectBar__proj_mgr">Manager: {props.proj.project_manager}</span>
        </li>
        <li className="ProjectBar__description">{props.proj.description}</li>
        <li>
          <div className="ProjectBar__proj_prog_date">
            <div className="ProjectBar__proj_prog">
              Est. Progress <ProgressBar percentage={props.proj.progress} />
            </div>
            Deadline: {dateConversions.TStoDisplayDate(props.proj.deadline)}
          </div>
        </li>
      </Link>
      {props.role === 'owner' && (
        <li>
          {!assign && (
            <button onClick={toggleAssign}>
              {props.proj.project_manager === 'unassigned' ? 'Assign' : 'Reassign'}
            </button>
          )}
          <button className="ProjectBar__edit" onClick={toggleEdit}>
            Edit
          </button>
        </li>
      )}
      {assign && (
        <li className="ProjectBar__selectPM">
          <Dropdown employees={renderPmList()} isMulti={false} setSelected={setSelected} />
          <div id="submit_pm">
            <button onClick={setProjectManager} disabled={!selectedProjectManager && true}>
              Submit
            </button>
            <button onClick={toggleAssign}>Cancel</button>
          </div>
        </li>
      )}
      {edit && (
        <ProjectForm
          org={props.proj.org_id}
          updateProjInState={props.updateProjInState}
          toggleForm={toggleEdit}
          proj={props.proj}
        />
      )}
    </ul>
  );
};

export default ProjectBar;
