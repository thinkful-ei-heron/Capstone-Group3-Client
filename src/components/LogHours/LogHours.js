import React, { useContext, useState, useEffect } from 'react'
import { useInput } from '../../hooks/useInput'
import { Label, Input } from '../Form/Form'
import dbServices from '../../services/dbServices'
import { AuthContext } from '../../services/Auth'
import Swal from 'sweetalert2'

const LogHours = props => {
  const { currentUser } = useContext(AuthContext)

  const { value: hours, bind: bindHours, reset: resetHours } = useInput('')

  const [submitted, setSubmitted] = useState(false)

  const getMaxHours = () => {
    let selectedJob = props.job
    let maxHours =
      parseInt(selectedJob.total_hours) - parseInt(selectedJob.hours_completed)

    return maxHours
  }

  const renderJobHours = () => {
    let selectedJob = props.job
    let hoursWorked = selectedJob.hours_completed
    let hoursNeeded = selectedJob.total_hours

    return (
      <span>
        This task has {hoursWorked} hours worked out of an estimated{' '}
        {hoursNeeded} hours needed.
      </span>
    )
  }

  const handleJobHoursSubmit = e => {
    e.preventDefault()
    let jobObj = props.job
    let oldHours = parseInt(jobObj.hours_completed)
    let newHours = oldHours + parseInt(hours)
    let employeeHoursObj = jobObj.employee_hours.find(
      item => item.name === currentUser.name
    )
    let oldEmpHours = parseInt(employeeHoursObj.hours)
    let newEmpHours = oldEmpHours + parseInt(hours)
    employeeHoursObj.hours = newEmpHours
    let index = jobObj.employee_hours.findIndex(
      item => item.name === employeeHoursObj.name
    )
    jobObj.employee_hours[index] = employeeHoursObj
    jobObj.hours_completed = newHours

    dbServices
      .editJob(jobObj.id, jobObj)
      .then(setSubmitted(true))
      .then(() => {
        props.renderLogHoursForm()
      })
      .catch(error => {
        console.warn(error)
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue - please refresh the page and try again.',
          icon: 'error',
          confirmButtonText: 'Close',
        })
      })
  }

  useEffect(() => {
    const resetFunction = async () => {
      resetHours()
    }
    if (submitted)
      return function resetAll() {
        resetFunction()
      }
  })

  return (
    <form onSubmit={e => handleJobHoursSubmit(e)} className="Form">
      <Label htmlFor="job_hours">
        Number of Hours Worked:
        <Input
          name="job_hours"
          type="number"
          placeholder={0}
          min="1"
          max={getMaxHours()}
          {...bindHours}
        />
      </Label>
      <div>{renderJobHours()}</div>
      <button
        onClick={() => props.renderLogHoursForm()}
        className="btn_secondary_color"
      >
        Cancel
      </button>
      <button type="submit" className="btn_highlight_color">
        Submit Hours
      </button>
    </form>
  )
}

export default LogHours
