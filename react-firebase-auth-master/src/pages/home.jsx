/* eslint-disable react/prop-types */
import { useState } from "react";
import { Navigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";

import { FaGoogle } from "react-icons/fa";

import logo from "../assets/logoImage.png";

import { auth } from "../firebase";
import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

export const Home = ({ user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

const handleSignInWithGoogle =() =>{
  signInWithPopup(auth,provider).then((res)=>{
    const credential = GoogleAuthProvider.credentialFromResult(res);
    const token = credential.accessToken;
    
    const user = res.user;
    console.log(user)
  })
}

  const handleSignUp = () => {
    if (!email || !password) {
      setPopupMessage("O e-mail e senha não conferem!");
      return;
    }
    if (password != confirmPassword) {
      setPopupMessage("as senhas não conferem!");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        userCredential.user.displayName = userName;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode == "auth/weak-password") {
          setPopupMessage(
            "Senha fraca, a senha deve conter no minimo 6 caracteres."
          );
        }
        console.log(errorCode);
      });
  };

  const handleSignIn = () => {
    if (!email || !password);
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
  const handleConfirmPasswordChange = (event) =>
    setConfirmPassword(event.target.value);
  const handleNameChange = (event) => setUserName(event.target.value);

  if (user) {
    return <Navigate to="/private"></Navigate>;
  }
  return (
    <section className="formContainer">
      <form>
        <div className="logoFormContainer">
          <img src={logo} alt="Blu Empresarial" />
        </div>
        {isSignUpActive && (
          <div className="legendContainer">
            <legend className="legend">Registre-se</legend>
          </div>
        )}
        {!isSignUpActive && <legend className="legend">Login</legend>}

        <span>{popupMessage}</span>

        <fieldset className="formList">
          <ul>
            {isSignUpActive &&(
            <li>
              <label htmlFor="name" className="inputTextLabel">
                Nome
              </label>
              <input
                type="text"
                id="name"
                className="inputText"
                placeholder="Jorge Antônio"
                onChange={handleNameChange}
              />
            </li>)}
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
            {isSignUpActive && (
              <li>
                <label htmlFor="confirmPassword" className="inputTextLabel">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  onChange={handleConfirmPasswordChange}
                  className="inputText"
                  placeholder="************"
                />
              </li>
            )}
          </ul>

          {isSignUpActive && (
            <button type="button" className="submitBtn" onClick={handleSignUp}>
              Registrar
            </button>
          )}
          {!isSignUpActive && (
            <button type="button" className="submitBtn" onClick={handleSignIn}>
              Entrar
            </button>
          )}
           {!isSignUpActive && (
            <button type="button" className="submitBtn" onClick={handleSignInWithGoogle}>
              Entrar com o Google <FaGoogle />
            </button>
          )}
        </fieldset>
        {isSignUpActive && (
          <p>
            já tem conta?{" "}
            <a className="link" onClick={handleMethodChange}>
              Login
            </a>
          </p>
        )}
        {!isSignUpActive && (
          <p>
            Não tem conta?{" "}
            <a className="link" onClick={handleMethodChange}>
              Cadastre-se
            </a>
          </p>
        )}
      </form>
    </section>
  );
};
