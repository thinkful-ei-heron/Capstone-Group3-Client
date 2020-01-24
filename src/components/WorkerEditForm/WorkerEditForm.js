import React, { useContext, useEffect, useState } from 'react'
import FirebaseContext from '../../services/context'
import { Label, Input, Textarea } from '../Form/Form'
import { useInput } from '../../hooks/useInput'

const WorkerEditForm = props => {
  // const [name, setName] = useState(props.job.name);
  // const [description, setDescription] = useState(prop.job.description);
  // const [totalHours, setTotalHours] = useState(prop.job.total_hours);
  // const [note, setNote] = useState("");
  const context = useContext(FirebaseContext)
  const [submitted, setSubmitted] = useState(false)
  const { value: name, bind: bindName, reset: resetName } = useInput('')
  const {
    value: description,
    bind: bindDescription,
    reset: resetDescription,
  } = useInput('')
  const {
    value: totalHours,
    bind: bindTotalHours,
    reset: resetTotalHours,
  } = useInput('')
  const { value: note, bind: bindNote, reset: resetNote } = useInput('')

  //request edit on name, description, total_hours, note

  const submitRequest = async e => {
    e.preventDefault()
    const editObj = {
      name: name,
      description: description,
      total_hours: parseInt(totalHours),
      note: note,
      employee: context.user.name,
    }
    if (
      props.job.name === name &&
      props.job.description === description &&
      props.job.total_hours === totalHours &&
      note === ''
    ) {
      console.log('nothing to update')
    } else {
      await context.updateEdit(editObj, props.job.id, props.job.project_id)
      await props
        .handleStatus(props.job.id, 'edit request')
        .then(setSubmitted(true))
    }
  }

  useEffect(() => {
    console.log(props.className)
  })

  useEffect(() => {
    const resetFunction = () => {
      resetName()
      resetNote()
      resetTotalHours()
      resetDescription()
    }
    if (submitted)
      return function resetAll() {
        resetFunction()
      }
  })

  return (
    <form id="workereditform__form" className={props.className}>
      <Label htmlFor="job_name">
        Job name
        <Input
          className="input"
          name="job_name"
          type="text"
          placeholder={props.job.name}
          {...bindName}
        />
      </Label>
      <Label htmlFor="job_description">
        Job Description
        <Textarea
          name="job_description"
          type="text"
          placeholder={props.job.name}
          {...bindDescription}
        />
      </Label>
      <Label htmlFor="job_total_hours">
        Total Hours: {props.job.total_hours}
        <Input
          name="job_total_hours"
          type="number"
          placeholder={props.job.total_hours}
          {...bindTotalHours}
        />
      </Label>
      <Label htmlFor="job_note">
        Note for Project Manager:
        <Textarea
          name="job_note"
          type="text"
          placeholder="Insert any notes here"
          {...bindNote}
        />
      </Label>
      <button className="btn_highlight_color" onClick={e => submitRequest(e)}>
        Submit Edit Request
      </button>
    </form>
  )
}

export default WorkerEditForm
