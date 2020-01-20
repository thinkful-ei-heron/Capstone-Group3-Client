import React, { useEffect, useState } from 'react';
import { Label, Input, Textarea } from '../Form/Form';
import { useInput } from '../../hooks/useInput';
import dbServices from '../../services/dbServices';

const WorkerEditForm = props => {
  const [submitted, setSubmitted] = useState(false);

  const { value: name, bind: bindName, reset: resetName } = useInput('');
  const {
    value: description,
    bind: bindDescription,
    reset: resetDescription
  } = useInput('');
  const {
    value: totalHours,
    bind: bindTotalHours,
    reset: resetTotalHours
  } = useInput('');
  const { value: note, bind: bindNote, reset: resetNote } = useInput('');

  const submitRequest = async e => {
    e.preventDefault();
    const editObj = {
      name: name,
      description: description,
      total_hours: parseInt(totalHours),
      note: note,
      employee: 'Test PM'
    };
    if (
      props.job.name === name &&
      props.job.description === description &&
      props.job.total_hours === totalHours &&
      note === ''
    ) {
      console.log('nothing to update');
    } else {
      await dbServices.updateEdit(
        editObj,
        props.job.id,
        props.job.project_id,
        props.job.organization
      );
      await props
        .handleStatus(props.job.id, 'edit request')
        .then(setSubmitted(true))
        .then(props.renderEditForm());
    }
  };

  useEffect(() => {
    const resetFunction = () => {
      resetName();
      resetNote();
      resetTotalHours();
      resetDescription();
    };
    if (submitted)
      return function resetAll() {
        resetFunction();
      };
  });

  return (
    <div>
      <Label htmlFor="job_name">
        Job name
        <Input
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
      <button onClick={e => submitRequest(e)}>Submit Edit Request</button>
    </div>
  );
};

export default WorkerEditForm;
