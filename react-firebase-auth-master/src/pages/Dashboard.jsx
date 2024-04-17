import { getAuth } from "firebase/auth";

import {
  getDatabase,
  ref,
  child,
  get,
  set,
  update,
  remove,
  onValue,
} from "firebase/database";

const auth = getAuth();
const user = auth.currentUser;

import "../styles/Dashboard.css";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const [users, setUsers] = useState([]);


  const db = getDatabase();

  useEffect(() => {
    onValue(ref(db), (snapshot) => {
      setUsers([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((user) => {
          setUsers((oldArray) => [...oldArray, user]);
         
          console.log(user)
        });
      }
    });
  }, []);



  return (
    <div>
      <ul>
        <li>
          <h2>Adm Login</h2>
          {users.map((user)=>(
            <>
            <h1>{user.userName}</h1>
            </>
          ))}
         
        </li>
      </ul>
    </div>
  );
};
