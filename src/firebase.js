import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAsCFFUfyE6jgG_OPiUPULaU867ZBQKD24",
  authDomain: "weather-api-b106a.firebaseapp.com",
  projectId: "weather-api-b106a",
  storageBucket: "weather-api-b106a.appspot.com",
  messagingSenderId: "269738895514",
  appId: "1:269738895514:web:c86eb7e0bc07e937e05723",
  measurementId: "G-DCRETX1QMP",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth };

export default db;
