import { getDatabase, ref, onValue, remove } from "firebase/database";

import { storage } from "../firebase";
import { deleteObject, listAll } from "firebase/storage";
import { ref as sref } from "firebase/storage";

import { signOut } from "firebase/auth";
import { auth } from '../firebase';

import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Icons

export const Dashboard = () => {
  const [users, setUsers] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [markedUsers, setMarkedUsers] = useState([]);
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

  const handleDelete = async (idToDelete) => {
    // Deletar usuário do Realtime Database
    await remove(ref(db, "UserSet/" + idToDelete))
      .then(() => {
        console.log(idToDelete);
      })
      .catch((err) => {
        console.log(err);
      });

    // Deletar arquivos do Firebase Storage
    const userFilesRef = sref(storage, `${idToDelete}/`);
    const userFilesList = await listAll(userFilesRef); // Listar todos os arquivos do usuário

    userFilesList.items.forEach((item) => {
      deleteObject(item)
        .then(() => {
          console.log("Arquivo deletado:", item.name);
        })
        .catch((error) => {
          console.log("Erro ao deletar arquivo:", error);
        });
    });

    // Deletar usuário da API
    await fetch(`http://localhost:3000/api/deleteUser/${idToDelete}`, {
      method: "DELETE",
    })
      .then(console.log("Usuário deletado!"))
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCheckboxChange = (userId) => {
    if (markedUsers.includes(userId)) {
      setMarkedUsers(markedUsers.filter((id) => id !== userId));
    } else {
      setMarkedUsers([...markedUsers, userId]);
    }
  };

  const handleDeleteMarkedUsers = () => {
    markedUsers.forEach((userId) => {
      handleDelete(userId);
    });
    setMarkedUsers([]);
  };

  return (
    <div className="mainDashboard">
      <div className="actionsButton">
        {markedUsers.length > 0 && (
          <button onClick={handleDeleteMarkedUsers}>
            Deletar usuários marcados
          </button>
        )}
        <button onClick={handleSignOut}>Sair</button>
      </div>
      <div className="dashboardContainer">
        <h1>Lista de Usuários</h1>

        <div className="searchContainer">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder={`Procurar usuario `}
          />
        </div>

        {users &&
          Object.keys(users).map((userName) => {
            const user = users[userName];
            const filterName = user.userName.name;
            const filtered = filterName
              .toLowerCase()
              .includes(searchName.toLowerCase());

            return (
              filtered && (
                <div key={userName} className="dashboardComponent">
                  <div className="user">
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      onChange={() => handleCheckboxChange(user.userName.id)}
                    />

                    <div className="userName">
                      <h3>{user.userName.name}</h3>
                      <p>{user.userName.email}</p>
                    </div>
                  </div>
                  <div className="dashboardButtons">
                    <Link
                      className="editButton"
                      to={`/editUser/${user.userName.id}`}
                    >
                      Editar usuário
                    </Link>

                    <input
                      type="button"
                      className="deleteButton"
                      value={"Excluir"}
                      onClick={() => {
                        handleDelete(user.userName.id);
                      }}
                    />
                  </div>
                </div>
              )
            );
          })}
      </div>
    </div>
  );
};
