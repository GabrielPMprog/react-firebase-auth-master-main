import React from "react";

import "../styles/editUser.css";

import { useParams } from "react-router-dom";
import { getDatabase, ref, get, update, push, child } from "firebase/database";

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

export function EditUser() {
  const [user, setUser] = useState({
    userName: {
      name: "",
      email: "",
      userId: "",
    },
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");


  const { id } = useParams();
  const db = getDatabase();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = ref(db, "UserSet/" + id);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUser(snapshot.val());
        } else {
          console.log("Usuário não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    setName(user.userName.name);
    setEmail(user.userName.email);
  
  }, [user]);

  function handleEdit() {
    const userRef = ref(db, `UserSet/${id}/userName`);

    // Cria um objeto com os novos dados do usuário
    const newData = {
      name: name,
      email: email,
    };

    // Atualiza os dados do usuário no banco de dados
    update(userRef, newData)
      .then(() => {
        console.log("Usuário atualizado com sucesso!");
      })
      .catch((error) => {
        console.log("Erro ao atualizar usuário:", error);
      });

    //Enviando dados para o backend

    fetch(`/api/updateUser/${user.userName.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, email: email, }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar usuário:", error);
      });
  }

  return (
    <form className="editContainer">
      <input
        className="input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input type="file" />
      <button type="button" onClick={handleEdit}>
        Enviar
      </button>
      <Link to={"/private"}>Voltar</Link>
    </form>
  );
}
