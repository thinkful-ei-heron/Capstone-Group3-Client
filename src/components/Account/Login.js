import React, { useContext } from "react";
import { useInput } from "../../hooks/useInput";
import FirebaseContext from "../../services/context";
import { auth } from "../../services/firebase";

const Login = props => {
  const fbContext = useContext(FirebaseContext);
  const { value: email, bind: bindEmail } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");

  const handleSubmit = evt => {
    evt.preventDefault();
    auth.setPersistence("local").then(() => {
      fbContext
        .doSignInWithEmailAndPassword(email, password)
        .then(token => {
          fbContext.newSetUser(email, token.user.displayName);
        })
        .then(() => props.history.push("/dashboard"));
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
