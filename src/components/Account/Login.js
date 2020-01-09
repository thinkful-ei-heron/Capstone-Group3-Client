import React, { useContext } from "react";
import { useInput } from "../../hooks/useInput";
import FirebaseContext from "../../services/context";

const Login = props => {
  const fbContext = useContext(FirebaseContext);
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useInput("");

  const handleSubmit = evt => {
    evt.preventDefault();
    fbContext
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        console.log(`Logging in: ${authUser.user.email}`);
      })
      .then(() => fbContext.setUser(email))
      .then(() => {
        resetEmail();
        resetPassword();
        props.history.push("/dashboard");
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Login</legend>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" {...bindEmail} required />
          <label htmlFor="password">Password:</label>
          <input
            name="password"
            id="password"
            type="password"
            {...bindPassword}
            required
          />
          <input type="submit" value="Submit" />
        </fieldset>
      </form>
    </>
  );
};

export { Login };
