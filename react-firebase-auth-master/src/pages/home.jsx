/* eslint-disable react/prop-types */
import { useState } from "react";
import { Navigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

import { getDatabase, ref, set } from "firebase/database";

import { FaGoogle } from "react-icons/fa";

import logo from "../assets/logoImage.png";

import { auth } from "../firebase";
import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();

export const Home = ({ user }) => {
  const db = getDatabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTimer, setPopupTimer] = useState("disabledPopup");
  const [userName, setUserName] = useState("");
  const [isSignUpActive, setIsSignUpActive] = useState(true);

  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
  };

  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, provider).then((res) => {
      const credential = GoogleAuthProvider.credentialFromResult(res);
      const token = credential.accessToken;

      const user = res.user;
      console.log(user);
    });
  };

  const handleSignUp = () => {
    if (!email || !password) {
      handleChangePopup("Preencha o formulário de forma completa!");
      return;
    }
    if (password != confirmPassword) {
      handleChangePopup("as senhas não conferem!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(auth.currentUser).then(() => {
          alert(
            `Mensagem de verificação enviada ao email: ${auth.currentUser.email}`
          );
        });

        const user = userCredential.user;
        user.displayName = userName;
        console.log(user);

        set(ref(db, "UserSet/" + user.uid), {
          userName: { name: user.displayName, email: user.email, id: user.uid },
        })
          .then(() => {
            console.log("Data added successfully!");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);

        if (errorCode == "auth/invalid-email") {
          handleChangePopup("Digite um e-mail válido");
        }

        if (errorCode == "auth/weak-password") {
          handleChangePopup(
            "Senha fraca, a senha deve conter no minimo 6 caracteres."
          );
        }
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
        if (errorCode == "auth/invalid-login-credentials") {
          handleChangePopup("O e-mail e senha não conferem!");
        }
        if (errorCode == "auth/invalid-email") {
          handleChangePopup("Digite um e-mail válido");
        }
        if (errorCode == "auth/missing-password") {
          handleChangePopup("Preencha o campo da senha");
        }
        if (errorCode == "auth/invalid-login-credentials") {
          handleChangePopup("Login e senha não conferem");
        }
        if (errorCode == "auth/too-many-requests") {
          handleChangePopup("Atualize a página e espere alguns segundos");
        }
        console.log(errorCode);
      });
  };

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert(`Um email de verificação foi enviado ao seu e-mail: ${email}!`);
      })
      .catch((err) => {
        const errorCode = err.code;
        if (errorCode == "auth/missing-email") {
          handleChangePopup("Digite seu e-mail");
        }
        console.log(errorCode);
      });
  };

  const handleChangePopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => {
      setPopupTimer("abledPopup");
    }, 3000);
    setPopupTimer("disabledPopup");
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);
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
        {!isSignUpActive && (
          <div className="legendContainer">
            <legend className="legend">Login</legend>
          </div>
        )}
        <div className="popupMessage">
          <span className={popupTimer}>{popupMessage}</span>
        </div>
        <fieldset className="formList">
          <ul>
            {isSignUpActive && (
              <li>
                <label htmlFor="name" className="inputTextLabel">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  className="inputText"
                  placeholder="Digite seu nome completo"
                  onChange={handleNameChange}
                  required
                />
              </li>
            )}
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
                required
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
                required
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
                  required
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
            <button
              type="button"
              className="submitBtn"
              onClick={handleSignInWithGoogle}
            >
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
        {!isSignUpActive && (
          <p>
            Esqueçeu sua senha?{" "}
            <a className="link" onClick={handleForgotPassword}>
              Clique aqui
            </a>
          </p>
        )}
      </form>
    </section>
  );
};
