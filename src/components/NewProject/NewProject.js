import React from "react";
import ProjectForm from "../ProjectForm/ProjectForm";

export default function NewProject(props) {
  return (
    <>
      <h1>New Project</h1>
      <ProjectForm {...props} />
    </>
  );
}
