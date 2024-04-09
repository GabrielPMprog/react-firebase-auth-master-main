import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export const Private = (props) => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  return (
    <section>
      <h2>Bem vindo, {props.user.displayName}!</h2>
      <button onClick={handleSignOut}>Sign Out</button>
    </section>
  );
};
