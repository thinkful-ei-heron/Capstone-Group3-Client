import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const styleIconMap = {
  plus: <FontAwesomeIcon icon={faPlus} />,
  minus: <FontAwesomeIcon icon={faMinus} />,
  collapse: <FontAwesomeIcon icon="angle-right" />,
  expand: <FontAwesomeIcon icon="angle-down" />,
  edit: <FontAwesomeIcon icon="edit" />,
  collapseBig: (
    <FontAwesomeIcon
      icon="chevron-up"
      style={{ fontSize: "25px", color: "rgba(255,255,255,.5" }}
    />
  ),
  expandBig: (
    <FontAwesomeIcon
      icon="chevron-down"
      style={{ fontSize: "25px", color: "rgba(255,255,255,.5" }}
    />
  ),
  default: null
};

export default function StyleIcon({ style = "default" }) {
  return styleIconMap[style];
}
