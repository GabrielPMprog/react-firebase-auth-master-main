import { signOut } from "firebase/auth";
import { auth } from "../firebase";

// Pages
import { ClientDashboard } from "./ClientDashboard";
import { DisabledClientDashboard } from "./DisabledClientDashboard";
import { Dashboard } from "./Dashboard";

import "../styles/private.css";

export const Private = (props) => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  if (auth.currentUser.email === "admlogin@gmail.com") {
    return <Dashboard />;
  } else {
    return (
      <section className="privateContainer">
        {auth.currentUser.emailVerified ? (
          <ClientDashboard />
        ) : (
          <DisabledClientDashboard />
        )}
        <button onClick={handleSignOut}>Sign Out</button>
      </section>
    );
  }
};
