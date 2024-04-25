import * as admin from "firebase-admin";
import serviceAccount from "../credentials.json";

const adm = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blu-comercial-default-rtdb.firebaseio.com",
});

export default adm;
