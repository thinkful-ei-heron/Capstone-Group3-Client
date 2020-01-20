import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../services/Auth";
import dbServices from "../../services/dbServices";
import { Link } from "react-router-dom";

const Sidebar = props => {
  let [employeeList, setEmployeeList] = useState([]);
  let [pmList, setPMList] = useState([]);
  let [expanded, setExpanded] = useState([]);
  let [clicked, setClick] = useState(false);
  const { currentUser } = useContext(AuthContext);

  if (clicked === true) setClick(false);

  const toggleExpand = section => {
    setClick(true);
    let newExpanded = [];
    if (!expanded.includes(section)) {
      newExpanded = expanded;
      newExpanded.push(section);
      setExpanded(newExpanded);
    } else {
      newExpanded = expanded.filter(item => item !== section);
      setExpanded(newExpanded);
    }
    return expanded;
  };

  useEffect(() => {
    console.log(props.view);
    const getEmployees = async () => {
      let employees = [];
      return await dbServices.getEmployees(currentUser.org).then(snapshot => {
        snapshot.forEach(doc => {
          employees.push(doc.data());
        });
        return employees;
      });
    };

    const getPMs = async () => {
      let pms = [];
      return await dbServices
        .getProjectManagers(currentUser.org)
        .then(snapshot => {
          snapshot.forEach(doc => {
            pms.push(doc.data());
          });
          return pms;
        });
    };

    // };
    // if (props.view === 'project') {
    //   setEmployeeList(props.project.project_workers);
    //   let pmList = [];
    //   pmList.push(props.project.project_manager);
    //   setPMList(pmList);
    // } else {
    getEmployees().then(employees => {
      setEmployeeList(employees);
    });
    getPMs().then(pms => {
      setPMList(pms);
    });
    // }
  }, []);

  const renderProjectManagers = () => {
    return pmList.map((pm, index) => {
      return (
        <li key={pm.name + index}>
          <Link to={`/profile/${pm.email}`}>{pm.name}</Link>
        </li>
      );
    });
  };

  const renderEmployees = () => {
    console.log(employeeList);
    return employeeList.map((emp, index) => {
      console.log(emp);
      return (
        <li key={emp.name + index}>
          <Link to={`/profile/${emp.email}`}>{emp.name}</Link>
        </li>
      );
    });
  };

  return (
    <div>
      <h3>
        <button onClick={() => toggleExpand("pm")}>Project Managers</button>
      </h3>
      {!expanded.includes("pm") ? <ul>{renderProjectManagers()}</ul> : <></>}
      <h3>
        <button onClick={() => toggleExpand("employees")}>Employees</button>
      </h3>
      {!expanded.includes("employees") ? <ul>{renderEmployees()}</ul> : <></>}
    </div>
  );
};

export default Sidebar;
