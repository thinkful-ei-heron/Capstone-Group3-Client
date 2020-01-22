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
          console.warn(error);
          Swal.fire({
            title: "Error!",
            text:
              error.code === "auth/user-not-found"
                ? "Incorrect email"
                : "Incorrect password",
            icon: "error",
            confirmButtonText: "Close"
          });
        });
    },
    [history]
  );

  if (currentUser) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="Login">
      <form className="Login__form" onSubmit={handleLogin}>
        <Label>
          Email
          <Input
            test-id="login-email"
            name="email"
            type="email"
            placeholder="Email"
            required
          />
        </Label>
        <Label>
          Password
          <Input
            test-id="login-password"
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </Label>
        <button type="submit" test-id="login-button">
          Log in
        </button>
      </form>
    </div>
  );
};

export default withRouter(Login);
