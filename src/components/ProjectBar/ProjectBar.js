import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import './ProjectBar.css';

const ProjectBar = props => {
  console.log(props.proj.progress);
  console.log(new Date(props.proj.deadline.seconds * 1000).toISOString().slice(0, 10));

  const setSelected = employee => {
    this.setState({
      selectedProjectManager: employee
    });
  };

  setProjectManager = () => {
    //code to set new PM for project
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
            Deadline: {new Date(props.proj.deadline.seconds * 1000).toISOString().slice(0, 10)}
          </div>
        </li>
        {props.role === 'owner' && props.proj.project_manager === 'unassigned' && (
          <li className="ProjectBar__selectPM">
            <span>SELECT Project Manager</span>
            <Dropdown employees={this.renderPmList()} isMulti={false} setSelected={this.setSelected} />
            {this.state.selectedProjectManager && (
              <div id="submit_pm">
                <button onClick={this.setProjectManager}></button>
              </div>
            )}
          </li>
        )}
      </Link>
    </ul>
  );
};

export default ProjectBar;
