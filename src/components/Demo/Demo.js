import React, { useContext, useState } from 'react';
import { withRouter, Redirect } from 'react-router';
import app from '../../services/base.js';
import { AuthContext } from '../../services/Auth.js';
import { Label, Input } from '../Form/Form';
import skyscraper from '../../images/skyscraper.svg';
import Swal from 'sweetalert2';
import './Demo.css';

const Demo = () => {
  const { currentUser } = useContext(AuthContext);
  const [role, setRole] = useState('worker');

  const handleLogin = async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    app
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .catch(error => {
        console.warn(error);
        Swal.fire({
          title: 'Error!',
          text:
            error.code === 'auth/user-not-found'
              ? 'Incorrect email'
              : 'Incorrect password',
          icon: 'error',
          confirmButtonText: 'Close',
        });
      });
  };

  const getValue = inputType => {
    if (role === 'worker') {
      if (inputType === 'email') {
        return 'jhalpert@dundermifflin.com';
      } else {
        return 'Password1!';
      }
    }
    if (role === 'manager') {
      if (inputType === 'email') {
        return 'mscott@dundermifflin.com';
      } else {
        return 'Password1!';
      }
    }
    if (role === 'owner') {
      if (inputType === 'email') {
        return 'dwallace@dundermifflin.com';
      } else {
        return 'Password1!';
      }
    }
  };

  const changeRole = (e, role) => {
    e.stopPropagation();
    setRole(role);
  };

  if (currentUser) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="Login LandingPage">
      <form className="Form Form__extra_padding SignUp" onSubmit={handleLogin}>
        <h1>I want to demo as a: </h1>
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
        <Label>
          Email
          <Input
            test-id="login-email"
            name="email"
            value={getValue('email')}
            type="email"
            placeholder="Email"
            required
            readOnly
          />
        </Label>
        <Label>
          Password
          <Input
            test-id="login-password"
            name="password"
            value={getValue('password')}
            type="password"
            placeholder="Password"
            required
            readOnly
          />
        </Label>
        <button
          className="btn_highlight_color"
          type="submit"
          test-id="login-button"
        >
          Log in
        </button>
      </form>
      <img src={skyscraper} alt="skyscraper" />
    </div>
  );
};

export default withRouter(Demo);
