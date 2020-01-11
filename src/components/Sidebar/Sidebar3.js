import React, { useContext, useState } from "react";
import FirebaseContext from "../../services/context";
import { ProjectManagers } from "./ProjectManagers";
import { ProjectWorkers } from "./ProjectWorkers";

const Sidebar = props => {
  const context = useContext(FirebaseContext);

  let [expanded, setExpanded] = useState([]);
  let [clicked, setClick] = useState(false);

  const toggleExpand = e => {
    setClick(true);
    let newExpanded = [];
    if (!expanded.includes(e.target.id)) {
      newExpanded = expanded;
      newExpanded.push(e.target.id);
      setExpanded(newExpanded);
    } else {
      newExpanded = expanded.filter(id => id !== e.target.id);
      setExpanded(newExpanded);
    }
    return expanded;
  };

  if (clicked === true) setClick(false);

  if (context.user.role === "project worker") {
    return <></>;
  }

  if (context.user.role === "project manager") {
    return (
      <>
        <h2>Employees</h2>
        <ul>
          {<ProjectWorkers expanded={expanded} toggleExpand={toggleExpand} />}
        </ul>
      </>
    );
  }

  if (context.user.role === "admin") {
    //change to admin
    return (
      <>
        <h2>PROJECT MANAGERS</h2>
        <ProjectManagers expanded={expanded} toggleExpand={toggleExpand} />
      </>
    );
  }
};

export { Sidebar };
