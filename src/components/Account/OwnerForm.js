import React, { useState, useEffect, useContext } from 'react'
import { withRouter } from 'react-router'
import app from '../../services/base'
import dbServices from '../../services/dbServices'
import { Label, Input } from '../Form/Form'
import useFormValidation from '../../hooks/useFormValidation'
import validateInput from '../../hooks/validateInput'
import { AuthContext } from '../../services/Auth'
import Swal from 'sweetalert2'
// import './SignUp.css'

const OwnerForm = ({ history }, props) => {
  const { currentUser } = useContext(AuthContext)
  const functions = app.functions()

  // const ownerForm = await functions.httpsCallable(
  //   'ownerForm'
  // )

  const inputValues = {
    email: '',
    name: '',
  }

  const [role, setRole] = useState('worker')

  const handleClick = async e => {
    e.preventDefault()
    const { email, name } = values
    let info = {
      email: email,
      name: name,
      org: currentUser.org,
      role,
    }
    console.log(info)
  }

  const changeRole = (e, role) => {
    e.stopPropagation()
    setRole(role)
  }

  const {
    handleSubmit,
    errors,
    handleChange,
    values,
    handleBlur,
    isSubmitting,
  } = useFormValidation(inputValues, validateInput.validateSignup, handleClick)

  return (
    <div className="Login">
      <form className="Login__form" onSubmit={e => handleClick(e)}>
        <h1>They are a: </h1>
        <div className="radio-toolbar">
          <Input
            type="radio"
            value="worker"
            id="check_worker"
            name="entry_type"
            checked={role === 'worker'}
            onChange={e => changeRole(e, 'worker')}
          />
          <Label htmlFor="check_worker">Project Worker</Label>
          <Input
            type="radio"
            value="manager"
            id="check_manager"
            name="entry_type"
            checked={role === 'manager'}
            onChange={e => changeRole(e, 'manager')}
          />
          <Label htmlFor="check_manager">Project Manager</Label>
          <Input
            type="radio"
            value="owner"
            id="check_owner"
            name="entry_type"
            checked={role === 'owner'}
            onChange={e => changeRole(e, 'owner')}
          />
          <Label htmlFor="check_owner">Company Owner</Label>
        </div>
        <Label htmlFor="name">
          Name
          <Input
            type="text"
            name="name"
            onChange={handleChange}
            value={values.name}
            onBlur={handleBlur}
            placeholder="name"
          />
          {errors.name && <p>*{errors.name}</p>}
        </Label>
        <Label>
          email
          <Input
            name="email"
            type="email"
            onChange={handleChange}
            value={values.email}
            onBlur={handleBlur}
            placeholder="Email"
          />
          {errors.email && <p>*{errors.email}</p>}
        </Label>

        <button type="submit" disabled={isSubmitting}>
          Send
        </button>
      </form>
    </div>
  )
}

export default withRouter(OwnerForm)
