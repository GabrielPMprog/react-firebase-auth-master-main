import { getDatabase, ref, onValue, remove } from "firebase/database";

import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      .then(() => console.log("Sign Out", auth.name))
      .catch((error) => console.log(error));
  };

  const handleDelete = (userNameToDelete, idToDelete) => {
    remove(ref(db, "UserSet/" + userNameToDelete))
      .then(() => {
        console.log(userNameToDelete);
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(`http://localhost:3000/api/deleteUser/${idToDelete}`, {
      method: "DELETE",
    })
      .then(console.log("Usuário deletado!"))
      .catch((error) => {
        console.log(error);
      });

    location.reload();
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
                <p>{user.userName.id}</p>
                <div className="dashboardButtons">
                  <Link 
                    to={{
                      pathname: `/editUser/${user.userName.name}`,
                      
                    }}
                  >
                    Editar usuário
                  </Link>

                  <input
                    type="button"
                    className="deleteButton"
                    value={"excluir"}
                    onClick={() => {
                      handleDelete(user.userName.name, user.userName.id);
                    }}
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
