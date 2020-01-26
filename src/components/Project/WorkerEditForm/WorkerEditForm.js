import React, { useState, useContext } from 'react';
import { Label, Input, Textarea } from '../../Form/Form';
import dbServices from '../../../services/dbServices';
import { AuthContext } from '../../../services/Auth';
import validateInput from '../../../hooks/validateInput';
import useFormValidation from '../../../hooks/useFormValidation';
import Swal from 'sweetalert2';

const WorkerEditForm = props => {
  // eslint-disable-next-line
  const [submitted, setSubmitted] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const INITIAL_STATE = {
    name: props.job.name,
    description: props.job.description,
    total_hours: props.job.total_hours,
    note: '',
    employee: currentUser.name,
  };

  const submitRequest = async () => {
    const { name, description, total_hours, note } = values;
    const editObj = {
      name: name,
      description: description,
      total_hours: parseInt(total_hours),
      note: note,
      employee: currentUser.name,
    };
    try {
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
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Close',
      });
    }
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isSubmitting,
  } = useFormValidation(
    INITIAL_STATE,
    validateInput.validateWorkerEditForm,
    submitRequest
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="Form">
        <Label htmlFor="name">
          Task name
          <Input
            name="name"
            id="name"
            type="text"
            onChange={handleChange}
            value={values.name}
            onBlur={handleBlur}
          />
        </Label>
        <Label htmlFor="description">
          Task Description
          <Textarea
            name="description"
            id="description"
            type="text"
            onChange={handleChange}
            value={values.description}
            onBlur={handleBlur}
          />
        </Label>
        <Label htmlFor="total_hours">
          Total Hours: {props.job.total_hours}
          <Input
            name="total_hours"
            id="total_hours"
            type="number"
            onChange={handleChange}
            value={values.total_hours}
            onBlur={handleBlur}
          />
        </Label>
        <Label htmlFor="note">
          Note for Project Manager:
          <Textarea
            name="note"
            id="note"
            type="text"
            onChange={handleChange}
            value={values.note}
            onBlur={handleBlur}
          />
        </Label>
        <input type="button" value="Cancel" onClick={props.renderEditForm} />
        <input type="submit" disabled={isSubmitting} value="Submit" />
      </form>
      {errors.note && <p>{errors.note}</p>}
    </>
  );
};

export default WorkerEditForm;
