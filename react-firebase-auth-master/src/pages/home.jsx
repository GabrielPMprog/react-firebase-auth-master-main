/* eslint-disable react/prop-types */
import { useState } from "react";
import { Navigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

import { getDatabase, ref, set } from "firebase/database";

import logo from "../assets/logoImage.png";

import { auth } from "../firebase";

// ICONS
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

export const Home = ({ user }) => {
  const db = getDatabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupTimer, setPopupTimer] = useState("disabledPopup");
  const [userName, setUserName] = useState("");
  const [isSignUpActive, setIsSignUpActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleMethodChange = () => {
    setIsSignUpActive(!isSignUpActive);
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
        if (errorCode == "auth/email-already-in-use") {
          handleChangePopup("E-mail já está em uso.");
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

            <li className="inputContainer">
              <label htmlFor="password" className="inputTextLabel">
                Senha
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                onChange={handlePasswordChange}
                className="inputText"
                placeholder="************"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className={`showPasswordButton`}
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}{" "}
                {/* Use os ícones */}
              </button>
            </li>
            {isSignUpActive && (
              <li className="inputContainer">
                <label htmlFor="confirmPassword" className="inputTextLabel">
                  Confirmar Senha
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  onChange={handleConfirmPasswordChange}
                  className="inputText"
                  placeholder="************"
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className={`showPasswordButton`}
                >
                  {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}{" "}
                  {/* Use os ícones */}
                </button>
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
        </fieldset>
        {isSignUpActive && (
          <p className="linkContainer">
            já tem conta?{" "}
            <a className="link" onClick={handleMethodChange}>
              Login
            </a>
          </p>
        )}
        {!isSignUpActive && (
          <p className="linkContainer">
            Não tem conta?{" "}
            <a className="link" onClick={handleMethodChange}>
              Cadastre-se
            </a>
          </p>
        )}
        {!isSignUpActive && (
          <p className="linkContainer">
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
