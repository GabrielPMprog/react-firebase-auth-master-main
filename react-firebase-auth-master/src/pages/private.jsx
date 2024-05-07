import { signOut } from "firebase/auth";
import { auth } from "../firebase";

// Pages
import { ClientDashboard } from "./ClientDashboard";
import { DisabledClientDashboard } from "./DisabledClientDashboard";
import { Dashboard } from "./Dashboard";

import "../styles/private.css";

export const Private = () => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  if (auth.currentUser.email === "contato@bluassessoriaempresarial.com.br") {
    return <Dashboard />;
  } else {
    return (
      <section className="privateContainer">
        {auth.currentUser.emailVerified ? (
          <ClientDashboard />
        ) : (
          <DisabledClientDashboard />
        )}
        <button className="signOutBtn" onClick={handleSignOut}>Sign Out</button>
      </section>
    );
  }
};
