import React, { useContext } from "react";
import { useInput } from "../../hooks/useInput";
import { FirebaseContext } from "../../services/index";

const Login = props => {
  const fbCon = useContext(FirebaseContext);
  const { value: email, bind: bindEmail, reset: resetEmail } = useInput("");
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword,
  } = useInput("");

  const handleSubmit = evt => {
    evt.preventDefault();
    fbCon
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        console.log(`Logging in: ${authUser.user.email}`);
      })
      .then(() => {
        resetEmail();
        resetPassword();
        props.history.push("/dashboard");
      })
      .catch(function(error) {
        throw new Error(error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Login</legend>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" {...bindEmail} required />
          <label htmlFor="password">Password:</label>
          <input name="password" type="password" {...bindPassword} required />
          <input type="submit" value="Submit" />
        </fieldset>
      </form>
    </>
  );
};

export { Login };
