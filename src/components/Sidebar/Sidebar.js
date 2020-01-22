import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../services/Auth'
import dbServices from '../../services/dbServices'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

const Sidebar = props => {
  let [employeeList, setEmployeeList] = useState([])
  let [pmList, setPMList] = useState([])
  let [expanded, setExpanded] = useState([])
  let [clicked, setClick] = useState(false)
  let [error, setError] = useState(false)
  const { currentUser } = useContext(AuthContext)

  if (clicked === true) setClick(false)

  const toggleExpand = section => {
    setClick(true)
    let newExpanded = []
    if (!expanded.includes(section)) {
      newExpanded = expanded
      newExpanded.push(section)
      setExpanded(newExpanded)
    } else {
      newExpanded = expanded.filter(item => item !== section)
      setExpanded(newExpanded)
    }
    return expanded
  }

  useEffect(() => {
    const getEmployees = async () => {
      let employees = []
      try {
        return await dbServices.getEmployees(currentUser.org).then(snapshot => {
          // return await dbServices.getEmployees().then(snapshot => {
          snapshot.forEach(doc => {
            employees.push(doc.data())
          })
          return employees
        })
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Employees failed to load. Sidebar temporarily disabled.',
          icon: 'error',
          confirmButtonText: 'Close',
          onClose: setError(true),
        })
      }
    }

    const getPMs = async () => {
      let pms = []
      try {
        return await dbServices
          .getProjectManagers(currentUser.org)
          .then(snapshot => {
            snapshot.forEach(doc => {
              pms.push(doc.data())
            })
            return pms
          })
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Employees failed to load. Sidebar temporarily disabled.',
          icon: 'error',
          confirmButtonText: 'Close',
          onClose: setError(true),
        })
      }
    }
    getEmployees().then(employees => {
      setEmployeeList(employees)
    })
    getPMs().then(pms => {
      setPMList(pms)
    })
  }, [])

  const renderProjectManagers = () => {
    return pmList.map((pm, index) => {
      return (
        <li key={pm.name + index}>
          <Link to={`/profile/${pm.email}`}>{pm.name}</Link>
        </li>
      )
    })
  }

  const renderEmployees = () => {
    return employeeList.map((emp, index) => {
      return (
        <li key={emp.name + index}>
          <Link to={`/profile/${emp.email}`}>{emp.name}</Link>
        </li>
      )
    })
  }
  if (error) return null
  // <div>
  //   <img
  //     src="https://media.giphy.com/media/jWexOOlYe241y/giphy.gif"
  //     alt="where is it?"
  //   />
  // </div>
  else
    return (
      <div>
        <h3>
          <button onClick={() => toggleExpand('pm')}>Project Managers</button>
        </h3>
        {!expanded.includes('pm') ? <ul>{renderProjectManagers()}</ul> : <></>}
        <h3>
          <button onClick={() => toggleExpand('employees')}>Employees</button>
        </h3>
        {!expanded.includes('employees') ? <ul>{renderEmployees()}</ul> : <></>}
      </div>
    )
}

export default Sidebar
