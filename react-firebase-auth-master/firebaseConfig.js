import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAIerjOT5OBlDUxGonU-wHLrfGxL-xx51E",
  authDomain: "blu-comercial.firebaseapp.com",
  projectId: "blu-comercial",
  storageBucket: "blu-comercial.appspot.com",
  messagingSenderId: "907938376070",
  appId: "1:907938376070:web:f4996313e6e4aa932e2407",
  measurementId: "G-JRM3VWMSJE",
};

// Utilize o Firebase Auth como antes
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

