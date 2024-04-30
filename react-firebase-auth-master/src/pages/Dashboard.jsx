import { getDatabase, ref, onValue, remove } from "firebase/database";

import { storage } from "../firebase";
import { v4 } from "uuid";
import { uploadBytes } from "firebase/storage";
import { ref as sref } from "firebase/storage";

import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [users, setUsers] = useState(null);
  const [file, setFile] = useState(null);
  const [searchName, setSearchName] = useState("");
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
    await remove(ref(db, "UserSet/" + idToDelete))
      .then(() => {
        console.log(idToDelete);
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
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const handleUpload = (id) => {
    if (file == null) {
      return;
    }

    const imageRef = sref(storage, `${id}/${file.name} - ${getTodayDate()}`);
    uploadBytes(imageRef, file)
      .then(() => {
        console.log("Upload do arquivo foi concluido");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = () => {
    // Lógica de pesquisa aqui
    console.log("Pesquisando usuário pelo nome:", searchName);
    // Implemente aqui a lógica para buscar usuários pelo nome
  };

  return (
    <div className="mainDashboard">
      <div className="actionsButton">
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      <div className="dashboardContainer">
        <div className="searchContainer">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Pesquisar por nome"
          />
          <button onClick={handleSearch}>Pesquisar</button>
        </div>

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
                  <Link to={`/editUser/${user.userName.id}`}>
                    Editar usuário
                  </Link>

                  <input
                    type="button"
                    className="deleteButton"
                    value={"excluir"}
                    onClick={() => {
                      handleDelete(user.userName.id);
                    }}
                  />
                  <input
                    type="file"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                  <button
                    onClick={() => {
                      handleUpload(user.userName.id);
                    }}
                  >
                    Enviar Arquivos
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
