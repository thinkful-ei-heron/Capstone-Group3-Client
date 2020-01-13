import React from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import './ProjectBar.css';

export default function ProjectBar(props) {
  return (
    <ul className="ProjectBar__project_container">
      <Link to={`/project/${props.proj.id}`} key={props.proj.id}>
        <li className="ProjectBar__li">
          <span className="ProjectBar__proj_name">{props.proj.name}</span>
          <span className="ProjectBar__proj_mgr">Manager: {props.proj.project_manager}</span>
        </li>
        <li>{props.proj.description}</li>
        <li>
          <div className="ProjectBar__proj_prog_date">
            <div className="Dashhboard__proj_prog">
              Est. Progress <ProgressBar percentage={props.proj.progress} />
            </div>
            {new Date(props.proj.deadline.seconds * 1000).toISOString().slice(0, 10)}
          </div>
        </li>
      </Link>
    </ul>
  );
}
