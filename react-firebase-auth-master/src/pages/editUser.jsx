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
  const [user, setUser] = useState({
    userName: {
      name: "",
      email: "",
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

  return (
    <form>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setName(e.target.value)}
      />
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
