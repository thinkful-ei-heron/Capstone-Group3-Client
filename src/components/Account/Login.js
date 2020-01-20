import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../../services/base.js";
import { AuthContext } from "../../services/Auth.js";
import { Label, Input } from "../Form/Form";
import "./Login.css";

const Login = ({ history }) => {
  const { currentUser } = useContext(AuthContext);
  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      await app
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then(() => history.push("/dashboard"))
        .catch(error => console.warn(error));
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
