const validateInput = {
  validateJobForm(values) {
    let errors = {};
  
    if (!values.name) {
      errors.name = "Task name is required";
    }
  
    if (values.name && (values.name.length === 0 || !values.name.trim())) {
      errors.name = "Task name is required"
    }
  
    if (!values.description) {
      errors.description = "Description is required"
    }
  
    if (values.description && (values.description.length === 0 || !values.description.trim())) {
      errors.description = "Task name is required"
    }
  
    if (!values.total_hours) {
      errors.total_hours = "Total hours is required"
    }
  
    if (!values.deadline) {
      errors.deadline = "Deadline is required"
    }
  
    if (values.deadline && (new Date() > new Date(values.deadline))) {
      errors.deadline = "Deadline must be in the future"
    }
  
    return errors;
  }

}


export default validateInput;