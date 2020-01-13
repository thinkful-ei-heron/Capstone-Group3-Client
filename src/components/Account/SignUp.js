import React from "react";
import { withRouter } from "react-router";
import app from "../../services/base";
import FirebaseContext from "../../services/context";

const SignUp = ({ history }) => {
  const fbContext = React.useContext(FirebaseContext);
  const handleSignUp = async event => {
    event.preventDefault();
    const { email, password, role, name, orgName } = event.target.elements;
    await app
      .auth()
      .createUserWithEmailAndPassword(email.value, password.value)
      .then(response => {
        return response.user.updateProfile({
          displayName: orgName.value,
        });
      })
      .then(() => {
        fbContext.createUserInOrg(
          {
            email: email.value,
            role: role.value,
            name: name.value,
          },
          orgName.value,
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
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSignUp}>
        <label>Email</label>
        <input name="email" type="email" placeholder="Email" required />
        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <label htmlFor="username">Username:</label>
        <input type="username" name="name" placeholder="Username" required />
        <label htmlFor="orgName">Orginization Name:</label>
        <input
          type="orgName"
          name="orgName"
          placeholder="Organization name"
          required
        />
        <label htmlFor="role">Role:</label>
        <input type="role" name="role" placeholder="role" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default withRouter(SignUp);
