import React from "react";
import ReactLoading from "react-loading";

export default function Loading(props) {
  return (
    <div className={props.className}>
      <ReactLoading type={"bars"} color={"#3b59ff"} />
    </div>
  );
}
