import React, { useContext, useCallback } from "react";
import FirebaseContext from "../../services/context";

const Sidebar = props => {

  const context = useContext(FirebaseContext)

  const projectManagerList = context.employees.filter(employee => (employee.role !== "project worker" && employee.role !== "admin"))
  const projectWorkerList = context.employees.filter(employee => (employee.role !== "project manager" && employee.role !== "admin"))

  const populateProjectList = (name, role) => {
    let projectList = []
    if(role === 'project manager') {
      context.projects.map(project => {
        if(project.project_manager === name) projectList.push(project.name)
      })
      return projectList
    } else {
      context.projects.map(project => {
        if(project.project_workers.includes(name)) projectList.push(project.name)
      })
      return projectList
    }
  }

  const populateProjectForWorker = name => {
    let projectList = []
    context.projects.map(project => {
      console.log(project.project_workers)
      // if(project.project_workers.includes(name)) projectList.push(project.name)
    })
    return projectList
  }

  const populateProjectManagers = () => projectManagerList.map(manager => {
    console.log(manager.name)
    return populateProjectList(manager.name, "project manager")
  })

  const populateProjectWorkersProjects = () => projectWorkerList.map(worker => {
    populateProjectWorkersProjects(worker.name, "project worker")
    // console.log(worker.name)
  })
  console.log(populateProjectManagers())
  // console.log(populateProjectWorkersProjects())
  // console.log(projectWorkerList)

  return(
    <>
      <h1>SIDEBAR</h1>
    </>
  )
}

export { Sidebar };