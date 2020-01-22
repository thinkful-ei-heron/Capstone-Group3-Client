import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../../services/base.js";
import { AuthContext } from "../../services/Auth.js";
import { Label, Input } from "../Form/Form";
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
        .catch(error => alert(error));
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
