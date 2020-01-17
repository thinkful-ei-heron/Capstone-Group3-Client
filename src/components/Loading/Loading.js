import React from "react";
import ReactLoading from "react-loading";
import "./Loading.css";

export default function Loading(props) {
  //{props.className}
  return (
    <div className="Loading">
      <ReactLoading
        type={"spokes"}
        color={"#3b59ff"}
        height={125}
        width={125}
      />
    </div>
  );
}
