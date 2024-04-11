/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";

import logo from "../assets/logoImage.png";

import { auth } from "../firebase";

export const AdmLogin = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email || !password) return;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  if (user) {
    return <Navigate to="/private"></Navigate>;
  }

  return (
    <section className="formContainer">
      <form>
        <div className="logoFormContainer">
          <img src={logo} alt="Blu Empresarial" />
        </div>

        <span>{popupMessage}</span>

        <fieldset className="formList">
          <ul>
            <li>
              <label htmlFor="email" className="inputTextLabel">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="inputText"
                placeholder="exemplo@gmail.com"
                onChange={handleEmailChange}
              />
            </li>
            <li>
              <label htmlFor="password" className="inputTextLabel">
                Senha
              </label>
              <input
                type="password"
                id="password"
                onChange={handlePasswordChange}
                className="inputText"
                placeholder="************"
              />
            </li>
          </ul>

          <button type="button" className="submitBtn" onClick={handleSignIn}>
            Entrar
          </button>
        </fieldset>

        <Link to="/">Voltar</Link>
      </form>
    </section>
  );
};
