import { signOut } from "firebase/auth";
import { auth } from "../firebase";

// Pages
import { ClientDashboard } from "./ClientDashboard";
import { DisabledClientDashboard } from "./DisabledClientDashboard";

import '../styles/private.css'

export const Private = (props) => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  return (
    <section className= 'privateContainer'>
      {auth.currentUser.emailVerified  ? <ClientDashboard /> : <DisabledClientDashboard />}
      <h2>Bem vindo, {props.user.displayName}!</h2>
      <button onClick={handleSignOut}>Sign Out</button>
    <input type="file" />
    </section>
  );
};
