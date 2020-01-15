import React, { useContext } from "react";
import FirebaseContext from "../../services/context";
import { Link } from "react-router-dom";

const OwnerNotification = props => {
  const context = useContext(FirebaseContext);

  const renderNewEmployees = () => {
    if (props.ownerList.newEmployees.length > 0) {
      return props.ownerList.newEmployees.map((employee, index) => {
        return (
          <li key={index + employee}>
            {employee.name} has joined your organization!
            <button onClick={e => handleNewEmployee(e, employee.id)}>
              Cool.
            </button>
          </li>
        );
      });
    }
  };

  const handleNewEmployee = async (e, id) => {
    e.preventDefault();
    let newEmployees = [];
    await context.updateNewEmployee(id);
    let employees = await context.getEmployees(context.user.org);
    employees.forEach(emp => {
      newEmployees.push(emp.data());
    });
    await context.setEmployeeState(newEmployees);
  };

  const handleClick = async id => {
    let newProjects = [];
    await context.updateProjectAlert(id);
    let projects = await context.getProjects(context.user.org);
    projects.forEach(proj => {
      newProjects.push(proj.data());
    });
    await context.setProjectState(newProjects);
  };

  const renderNewProjects = () => {
    if (props.ownerList.newProjects.length > 0) {
      return props.ownerList.newProjects.map(project => {
        return (
          <li key={project.id}>
            <Link
              onClick={() => handleClick(project.id)}
              to={{ pathname: `/project/${project.id}` }}
            >
              {project.name} has started.
            </Link>
          </li>
        );
      });
    }
  };

  const renderCompletedProjects = () => {
    if (props.ownerList.completedProjects.length > 0) {
      return props.ownerList.completedProjects.map(project => {
        return (
          <li key={project.id}>
            <Link
              onClick={() => handleClick(project.id)}
              to={{ pathname: `/project/${project.id}` }}
            >
              {project.name} has been completed!
            </Link>
          </li>
        );
      });
    }
  };

  return (
    <div>
      <ul>
        {renderNewEmployees()}
        {renderNewProjects()}
        {renderCompletedProjects()}
      </ul>
    </div>
  );
};

export default OwnerNotification;
