import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import app from '../../services/base';
import dbServices from '../../services/dbServices';
import { Label, Input } from '../Form/Form';
import useFormValidation from '../../hooks/useFormValidation';
import validateInput from '../../hooks/validateInput';
import skyscraper from '../../images/skyscraper.svg';
import Swal from 'sweetalert2';
import './SignUp.css';

const SignUp = ({ history }, props) => {
  const functions = app.functions();

  const inputValues = {
    email: '',
    name: '',
    password: '',
    orgName: '',
  };

  const [orgList, setOrgList] = useState([]);
  const [role, setRole] = useState('worker');

  const getOrgs = async () => {
    let orgs = [];
    const dborgs = await dbServices.getAllOrgs();
    dborgs.forEach(item => orgs.push(item.data().name));
    return orgs;
  };

  useEffect(() => {
    getOrgs().then(list => setOrgList(list));
  }, []);

  const handleSignUp = async () => {
    const { email, name, password, orgName } = values;
    const registerOwner = await functions.httpsCallable('registerOwner');
    const registerWorker = await functions.httpsCallable('registerWorker');
    const registerProjectManager = await functions.httpsCallable(
      'registerProjectManager'
    );
    let info = {
      email: email,
      password: password,
      name: name,
      org: orgName,
      displayName: name,
    };
    let infoNoPass = {
      email: email,
      name: name,
      org: orgName,
      displayName: name,
    };
    switch (role) {
      case 'owner':
        registerOwner(info)
          .then(() =>
            dbServices.createOwner({ ...infoNoPass, role: 'owner' }, info.org)
          )
          .catch(error => {
            console.warn(error);
            Swal.fire({
              title: 'Error!',
              text:
                'There was an issue with registration - please refresh the page and try again.',
              icon: 'error',
              confirmButtonText: 'Close',
            });
          });
        break;
      case 'worker':
        registerWorker(info)
          .then(() =>
            dbServices.createUserInOrg(
              { ...infoNoPass, role: 'project worker' },
              orgName
            )
          )
          .catch(error => {
            console.warn(error);
            Swal.fire({
              title: 'Error!',
              text:
                'There was an issue with registration - please refresh the page and try again.',
              icon: 'error',
              confirmButtonText: 'Close',
            });
          });
        break;
      case 'manager':
        registerProjectManager(info)
          .then(() =>
            dbServices.createUserInOrg(
              { ...infoNoPass, role: 'project manager' },
              orgName
            )
          )
          .catch(error => {
            console.warn(error);
            Swal.fire({
              title: 'Error!',
              text:
                'There was an issue with registration - please refresh the page and try again.',
              icon: 'error',
              confirmButtonText: 'Close',
            });
          });
        break;
      default:
        break;
    }
    history.push('/login');
    return `${email} signed up`;
  };

  const renderOrgSelect = () => {
    if (role === 'owner') {
      return (
        <Input
          type="text"
          name="orgName"
          onChange={handleChange}
          value={values.orgName}
          onBlur={handleBlur}
          placeholder="Organization name"
        />
      );
    }
    return (
      <select
        name="orgName"
        onChange={handleChange}
        value={values.orgName}
        onBlur={handleBlur}
        placeholder="Organization name"
      >
        <option value="" disabled hidden>
          Choose Organization...
        </option>
        {orgList && orgList.length > 0 ? (
          orgList.map((item, i) => {
            return (
              <option key={i} value={item}>
                {item}
              </option>
            );
          })
        ) : (
          <></>
        )}
      </select>
    );
  };

  const changeRole = (e, role) => {
    e.stopPropagation();
    setRole(role);
  };

  const {
    handleSubmit,
    errors,
    handleChange,
    values,
    handleBlur,
    isSubmitting,
  } = useFormValidation(
    inputValues,
    validateInput.validateSignup,
    handleSignUp
  );

  return (
    <div className="Register LandingPage">
      <form className="Form Form__extra_padding SignUp" onSubmit={handleSubmit}>
        <h1>I am a: </h1>
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
        {errors.email && <span className="error">*{errors.email}</span>}
        <Label>
          Email
          <Input
            name="email"
            type="email"
            onChange={handleChange}
            value={values.email}
            onBlur={handleBlur}
            placeholder="Email"
          />
        </Label>
        {errors.password && <span className="error">*{errors.password}</span>}
        <Label>
          Password
          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
        </Label>
        {errors.name && <span className="error">*{errors.name}</span>}
        <Label htmlFor="username">
          Username
          <Input
            type="text"
            name="name"
            onChange={handleChange}
            value={values.name}
            onBlur={handleBlur}
            placeholder="Username"
          />
        </Label>
        {errors.orgName && <span className="error">*{errors.orgName}</span>}
        <Label htmlFor="orgName">Organization Name</Label>
        {renderOrgSelect()}
        <button
          className="btn_highlight_color"
          type="submit"
          disabled={isSubmitting}
        >
          Sign Up
        </button>
      </form>
      <img src={skyscraper} alt="skyscraper" />
    </div>
  );
};

export default withRouter(SignUp);
