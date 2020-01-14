import React from "react";
import "./ProgressBar.css";

export const ProgressBar = props => {
  return (
      <div className="ProgressBar__meter">
        <span
          className="ProgressBar__fill"
          style={{ width: props.percentage + "%" }}
        ></span>
        <span className="ProgressBar__text">{props.percentage}%</span>
      </div>
  );
};
