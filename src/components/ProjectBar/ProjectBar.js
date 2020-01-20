import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import dbServices from '../../services/dbServices';
import dateConversions from '../../services/dateConversions';
import Dropdown from '../Dropdown/Dropdown';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import ProjectForm from '../ProjectForm/ProjectForm';
import StyleIcon from '../StyleIcon/StyleIcon';
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
    await db.setProjectsManager(
      props.proj.id,
      props.proj.org_id,
      selectedProjectManager.value
    );
    props.updatePM(props.proj.id, selectedProjectManager.value);
    toggleAssign();
  };

  const toggleAssign = () => {
    setAssign(!assign);
  };

  const toggleEdit = () => {
    setEdit(!edit);
  };

  // const renderPmList = () => {
  //   let result = [];
  //   props.projectManagers.forEach(pm => result.push(pm.name));
  //   return result;
  // };

  return (
    <div className="ProjectBar__project_container">
      <Link
        className="ProjectBar__link_wrapper"
        to={`/project/${props.proj.id}`}
        key={props.proj.id}
      >
        <div className="ProjectBar__header">
          <span className="ProjectBar__proj_name">{props.proj.name}</span>
          <span className="ProjectBar__proj_mgr">
            Manager: {props.proj.project_manager}
          </span>
        </div>
        <div className="ProjectBar__description">
          <span>Description:</span>
          <div className="ProjectBar__description_text">
            {props.proj.description}
          </div>
        </div>
        <div className="ProjectBar__proj_prog_date">
          <div className="ProjectBar__proj_prog">
            Est. Progress <ProgressBar percentage={props.proj.progress} />
          </div>
          Deadline: {dateConversions.TStoDisplayDate(props.proj.deadline)}
        </div>
      </Link>
      {props.role === 'owner' && (
        <div className="ProjectBar__buttons">
          {!assign && (
            <button onClick={toggleAssign}>
              {props.proj.project_manager === 'unassigned'
                ? 'Assign'
                : 'Reassign'}
            </button>
          )}
          <div className="ProjectBar__edit" onClick={toggleEdit}>
            {StyleIcon({ style: 'edit' })}
          </div>
        </div>
      )}
      {assign && (
        <div className="ProjectBar__selectPM">
          <Dropdown pm={true} isMulti={false} setSelected={setSelected} />
          <div id="submit_pm">
            <button
              onClick={setProjectManager}
              disabled={!selectedProjectManager && true}
            >
              Submit
            </button>
            <button onClick={toggleAssign}>Cancel</button>
          </div>
        </div>
      )}
      {edit && (
        <ProjectForm
          org={props.proj.org_id}
          updateProjInState={props.updateProjInState}
          toggleForm={toggleEdit}
          proj={props.proj}
        />
      )}
    </div>
  );
};

export default ProjectBar;
