import React from "react";
import { withRouter } from "react-router";
import app from "../../services/base";
import FirebaseContext from "../../services/context";
import { Label, Input } from "../Form/Form";

const SignUp = ({ history }, props) => {
  const fbContext = React.useContext(FirebaseContext);
  const handleSignUp = async event => {
    event.preventDefault();
    const { email, password, role, name, orgName } = event.target.elements;
    await app
      .auth()
      .createUserWithEmailAndPassword(email.value, password.value)
      .then(response => {
        return response.user.updateProfile({
          displayName: orgName.value
        });
      })
      .then(() => {
        history.location.pathname === "/owner-signup"
          ? fbContext.createOwner(
              {
                email: email.value,
                role: role.value,
                name: name.value
              },
              orgName.value
            )
          : fbContext.createUserInOrg(
              {
                email: email.value,
                role: role.value,
                name: name.value
              },
              orgName.value
            );
      })
      .then(async () => {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/dashboard");
      });
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
        <Label htmlFor="role">
          Role
          <Input type="role" name="role" placeholder="role" required />
        </Label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default withRouter(SignUp);
