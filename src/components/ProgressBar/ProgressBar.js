import React from 'react';
import './ProgressBar.css';

const Filler = props => {
  return <div className="filler" style={{ width: `${props.percentage}%` }}></div>;
};

export const ProgressBar = props => {
  return (
    <div className="progress-bar">
      {props.percentage}%
      <Filler percentage={props.percentage} />
    </div>
  );
};
