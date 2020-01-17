import React from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import './ProjectBar.css';

const ProjectBar = props => {
  console.log(props.proj.id);
  return (
    <ul className='ProjectBar__project_container'>
      <Link
        className='ProjectBar__link_wrapper'
        to={`/project/${props.proj.id}`}
        key={props.proj.id + 1}
      >
        <li key={props.proj.id + 2} className='ProjectBar__header'>
          <span className='ProjectBar__proj_name'>{props.proj.name}</span>
          <span className='ProjectBar__proj_mgr'>
            Manager: {props.proj.project_manager}
          </span>
        </li>
        <li key={props.proj.id + 3} className='ProjectBar__description'>
          {props.proj.description}
        </li>
        <li key={props.proj.id + 4}>
          <div className='ProjectBar__proj_prog_date'>
            <div className='ProjectBar__proj_prog'>
              Est. Progress <ProgressBar percentage={props.proj.progress} />
            </div>
            Deadline:{' '}
            {new Date(props.proj.deadline.seconds * 1000)
              .toISOString()
              .slice(0, 10)}
          </div>
        </li>
      </Link>
    </ul>
  );
};

export default ProjectBar;
