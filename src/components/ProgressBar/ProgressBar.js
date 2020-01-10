import React from "react";

const Filler = props => {
  return (
    <div className="filler" style={{ width: `${props.percentage}%` }}>
      {props.percentage}%
    </div>
  );
};

export const ProgressBar = props => {
  return (
    <div className="progress-bar">
      <Filler percentage={props.percentage} />
    </div>
  );
};
