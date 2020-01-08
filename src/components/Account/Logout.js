import myFirebase from "../../services/firebase";

const Logout = props => {
  myFirebase
    .auth()
    .signOut()
    .then(() => {
      props.updateUser({});
      props.history.push("/dashboard");
    })
    .catch(function(error) {
      throw new Error(error);
    });
};

export { Logout };
