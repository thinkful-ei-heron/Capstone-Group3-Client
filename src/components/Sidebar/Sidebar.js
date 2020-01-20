import React, { useState, useEffect } from "react";
import dbServices from "../../services/dbServices";
import { Link } from "react-router-dom";

const Sidebar = props => {
  let [employeeList, setEmployeeList] = useState([]);
  let [pmList, setPMList] = useState([]);
  let [expanded, setExpanded] = useState([]);
  let [clicked, setClick] = useState(false);

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
    const getEmployees = async () => {
      let employees = [];
      return await dbServices.getEmployees(props.user.org).then(snapshot => {
        snapshot.forEach(doc => {
          employees.push(doc.data());
        });
        return employees;
      });
    };

    const getPMs = async () => {
      let pms = [];
      return await dbServices
        .getProjectManagers(props.user.org)
        .then(snapshot => {
          snapshot.forEach(doc => {
            pms.push(doc.data());
          });
          return pms;
        });
    };

    getEmployees().then(employees => {
      setEmployeeList(employees);
    });
    getPMs().then(pms => {
      setPMList(pms);
    });
  }, []);

  const renderProjectManagers = () => {
    return pmList.map((pm, index) => {
      return (
        <li key={pm.name + index}>
          <Link to={{ pathname: `/profile/${pm.email}` }}>{pm.name}</Link>
        </li>
      );
    });
  };

  const renderEmployees = () => {
    return employeeList.map((emp, index) => {
      return (
        <li key={emp.name + index}>
          <Link to={{ pathname: `/profile/${emp.email}` }}>{emp.name}</Link>
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
