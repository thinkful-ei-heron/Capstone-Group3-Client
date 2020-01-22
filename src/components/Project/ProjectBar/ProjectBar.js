import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import dateConversions from '../../../services/dateConversions';
import { ProgressBar } from '../../ProgressBar/ProgressBar';
import ProjectForm from '../ProjectForm/ProjectForm';
import StyleIcon from '../../StyleIcon/StyleIcon';
import './ProjectBar.css';

const ProjectBar = props => {
  const [edit, setEdit] = useState(false);

  const toggleEdit = () => {
    setEdit(!edit);
  };

  return (
    <div className="ProjectBar__project_container">
      <Link className="ProjectBar__link_wrapper" to={`/project/${props.proj.id}`} key={props.proj.id}>
        <div className="ProjectBar__header">
          <span className="ProjectBar__proj_name">{props.proj.name}</span>
          <span className="ProjectBar__proj_mgr">Manager: {props.proj.project_manager}</span>
        </div>
        <div className="ProjectBar__description">
          <span>Description:</span>
          <div className="ProjectBar__description_text">{props.proj.description}</div>
        </div>
        {props.proj.progress === 100 ? (
          <p>Project Completed on {props.proj.date_completed && dateConversions.TStoDisplayDate(props.proj.date_completed)}</p>
        ) : (
          <div className="ProjectBar__proj_prog_date">
            <div className="ProjectBar__proj_prog">
              Est. Progress <ProgressBar percentage={props.proj.progress} />
            </div>
            Deadline: {dateConversions.TStoDisplayDate(props.proj.deadline)}
            {props.proj.progress !== 100 ? (dateConversions.dateDiff(props.proj.deadline)
             && `Overdue by ${dateConversions.dateDiff(props.proj.deadline)} days`) : ''}
          </div>
        )}
      </Link>
      {props.role === 'owner' && (
        <div className="ProjectBar__buttons">
          <div className="ProjectBar__edit" onClick={toggleEdit}>
            {StyleIcon({ style: 'edit' })}
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
