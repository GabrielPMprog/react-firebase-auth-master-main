import { getDatabase, ref, onValue } from "firebase/database";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";



import "../styles/Dashboard.css";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const [users, setUsers] = useState(null);
  const db = getDatabase();

  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((user) => {
          setUsers(user);
        });
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  const handleDelete = (user) => {
 
// const databaseRef = firebase.database().ref(user)
// databaseRef.remove()

  };

  return (
    <div className="mainDashboard">
      <div className="actionsButton">
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      <div className="dashboardContainer">
        <h1>Lista de Usuários</h1>
        {users &&
          Object.keys(users).map((userName) => {
            const user = users[userName];
            return (
              <div key={userName} className="dashboardComponent">
                <h2>{user.userName.name}</h2>
                <p>{user.userName.email}</p>
                <div className="dashboardButtons">
                  <input
                    type="button"
                    className="editButton"
                    value={"editar"}
                  />
                  <input
                    type="button"
                    className="deleteButton"
                    value={"excluir"}
                    onClick={handleDelete(user)}
                  />
                  <input type="file" className="fileButton" />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
