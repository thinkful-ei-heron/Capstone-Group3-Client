import React from "react";
import { withRouter } from "react-router";
import app from "../../services/base";
import dbServices from "../../services/dbServices";
import { Label, Input } from "../Form/Form";

const SignUp = ({ history }, props) => {
  const functions = app.functions();
  const handleSignUp = async event => {
    event.preventDefault();
    console.log(event.target.elements);
    let { email, password, name, orgName } = event.target.elements;
    const registerOwner = await functions.httpsCallable("registerOwner");
    const registerWorker = await functions.httpsCallable("registerWorker");
    let values = {
      email: email.value,
      password: password.value,
      name: name.value,
      org: orgName.value,
      displayName: name.value,
      role: "owner"
    };
    let valuesNoPass = {
      email: email.value,
      name: name.value,
      org: orgName.value,
      displayName: name.value,
      role: "project worker"
    };
    switch (history.location.pathname) {
      case "/owner-signup":
        registerOwner(values)
          .then(() => dbServices.createOwner(valuesNoPass, values.org))
          .catch(error => alert(error));
        break;
      case "/worker-signup":
        registerWorker(values).then(() =>
          dbServices.createUserInOrg(valuesNoPass, orgName.value)
        );
        break;
      default:
        registerWorker(values);
    }
    history.push("/login");
    return `${values.email} signed up`;
  };

  return (
    <div className="Login">
      <h1>Sign up</h1>
      <form className="Login__form" onSubmit={handleSignUp}>
        <Label>
          email
          <Input name="email" type="email" placeholder="Email" required />
        </Label>
        <Label>
          Password
          <Input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </Label>
        <Label htmlFor="username">
          Username
          <Input type="username" name="name" placeholder="Username" required />
        </Label>
        <Label htmlFor="orgName">
          Orginization Name
          <Input
            type="orgName"
            name="orgName"
            placeholder="Organization name"
            required
          />
        </Label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default withRouter(SignUp);
