import dateConversions from '../services/dateConversions'

const validateInput = {
  validateJobForm(values) {
    let errors = {}

    if (!values.name) {
      errors.name = 'Task name is required'
    }

    if (values.name && (values.name.length === 0 || !values.name.trim())) {
      errors.name = 'Task name is required'
    }

    if (!values.description) {
      errors.description = 'Description is required'
    }

    if (
      values.description &&
      (values.description.length === 0 || !values.description.trim())
    ) {
      errors.description = 'Description is required'
    }

    if (!values.total_hours) {
      errors.total_hours = 'Total hours is required'
    }

    if (!values.deadline) {
      errors.deadline = 'Deadline is required'
    }

    if (values.deadline && new Date() > new Date(values.deadline)) {
      errors.deadline = 'Deadline must be in the future'
    }

    return errors
  },

  validateLogin(values) {
    let errors = {}

    if (!values.email) {
      errors.email = 'Please enter your email'
    }
    if (!values.password) {
      errors.password = 'Please enter your password'
    }

    return errors
  },

  validateSignup(values) {
    let errors = {}
    let passRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    )

    if (!values.email) {
      errors.email = 'Please enter your email'
    }
    if (
      values.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z].{2,}$/i.test(values.email)
    ) {
      errors.email = 'Please enter a valid email address'
    }

    if (!values.password) {
      errors.password = 'Please enter a password'
    }
    if (values.password && !passRegex.test(values.password)) {
      errors.password =
        'Password must be eight characters or longer and contain at least 1 lowercase, 1 uppercase, 1 numeric, and one special character'
    }

    if (!values.name) {
      errors.name = 'Please enter a username'
    }

    if (!values.orgName) {
      errors.orgName = 'Please enter an organization name'
    }

    return errors
  },

  validateProjectForm(values) {
    let errors = {}

    if (!values.name) {
      errors.name = 'Project name is required'
    }
    if (values.name && (values.name.length === 0 || !values.name.trim())) {
      errors.name = 'Project name is required'
    }

    if (!values.description) {
      errors.description = 'Description is required'
    }
    if (
      values.description &&
      (values.description.length === 0 || !values.description.trim())
    ) {
      errors.description = 'Description is required'
    }

    if (!values.deadline) {
      errors.deadline = 'Deadline is required'
    }
    if (
      values.deadline &&
      Math.floor(Date.now() / 1000) >
        dateConversions.dateToTimestamp(new Date(values.deadline)).seconds
    ) {
      errors.deadline = 'Deadline must be in the future'
    }

    return errors
  },

  validateWorkerEditForm(values) {
    let errors = {}

    if (!values.note) {
      errors.note = 'A note is required'
    }
    if (values.note && (values.note.length === 0 || !values.note.trim())) {
      errors.note = 'Description is required'
    }

    return errors
  },
}

export default validateInput
