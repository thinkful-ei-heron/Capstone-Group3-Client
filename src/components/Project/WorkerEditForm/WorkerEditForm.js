import React, { useEffect, useState, useContext } from "react";
import { Label, Input, Textarea } from "../../Form/Form";
import { useInput } from "../../../hooks/useInput";
import dbServices from "../../../services/dbServices";
import { AuthContext } from "../../../services/Auth";
import validateInput from "../../../hooks/validateInput";
import useFormValidation from "../../../hooks/useFormValidation";

const WorkerEditForm = props => {
  const [submitted, setSubmitted] = useState(false);
  const { currentUser } = useContext(AuthContext);

  // const { value: name, bind: bindName, reset: resetName } = useInput("");
  // const {
  //   value: description,
  //   bind: bindDescription,
  //   reset: resetDescription
  // } = useInput("");
  // const {
  //   value: totalHours,
  //   bind: bindTotalHours,
  //   reset: resetTotalHours
  // } = useInput("");
  // const { value: note, bind: bindNote, reset: resetNote } = useInput("");

  const INITIAL_STATE = {
    name: props.job.name,
    description: props.job.description,
    total_hours: props.job.total_hours,
    note: "",
    employee: currentUser.name
  };

  const submitRequest = async () => {
    const { name, description, total_hours, note } = values;
    const editObj = {
      name: name,
      description: description,
      total_hours: parseInt(total_hours),
      note: note,
      employee: currentUser.name
    };

    if (
      props.job.name === name &&
      props.job.description === description &&
      props.job.total_hours === total_hours &&
      note === ""
    ) {
      console.log("nothing to update");
    } else {
      await dbServices.updateEdit(
        editObj,
        props.job.id,
        props.job.project_id,
        props.job.organization
      );
      await props
        .handleStatus(props.job.id, "edit request")
        .then(setSubmitted(true))
        .then(props.renderEditForm());
    }
  };

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    isSubmitting
  } = useFormValidation(
    INITIAL_STATE,
    validateInput.validateWorkerEditForm,
    submitRequest
  );

  // useEffect(() => {
  //   const resetFunction = () => {
  //     resetName();
  //     resetNote();
  //     resetTotalHours();
  //     resetDescription();
  //   };
  //   if (submitted)
  //     return function resetAll() {
  //       resetFunction();
  //     };
  // });

  return (
    <>
      <form onSubmit={handleSubmit}>
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
        <input type="button" value="cancel" onClick={props.renderEditForm} />
        <input type="submit" disabled={isSubmitting} value="Submit" />
      </form>
      {errors.note && <p>{errors.note}</p>}
    </>
  );
};

export default WorkerEditForm;
