import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../../services/base.js"; 
import { AuthContext } from "../../services/Auth.js";
import { Label, Input } from "../Form/Form";
import Swal from "sweetalert2";
import "./Login.css";

const Login = (setPath, { history }) => {
  const { currentUser } = useContext(AuthContext);

  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      await app
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .catch(error => {
          console.warn(error)
          Swal.fire({
            title: "Error!",
            text: error.code === 'auth/user-not-found' ? 'Incorrect email' : 'Incorrect password',
            icon: 'error',
            confirmButtonText: 'Close'
          })
        });
    },
    [history]
  );

  if (currentUser) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="Login">
      <h1>Log in</h1>
      <form className="Login__form" onSubmit={handleLogin}>
        <Label>
          Email
          <Input name="email" type="email" placeholder="Email" />
        </Label>
        <Label>
          Password
          <Input name="password" type="password" placeholder="Password" />
        </Label>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default withRouter(Login);
