import React from "react";

import { useParams } from "react-router-dom";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  get,
  child,
} from "firebase/database";

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

export function EditUser() {
  const [user, setUser] = useState('');

  const { id } = useParams();
  const db = getDatabase();

  const userId = localStorage.getItem(id); // Obtém o ID do usuário do localStorage

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

    if (userId) {
        fetchUser();
      }
  }, [id]);

  return (
    <form>
      <input type="text" placeholder={user.userName.name} />
      <input type="email" placeholder={user.userName.email} />
      <input type="file" />
      <input type="submit" />
      <Link
        to={{
          pathname: `/dashboard`,
        }}
      >
        Voltar
      </Link>
    </form>
  );
}
