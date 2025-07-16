import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRLctKtrh8rzQkShOQ0mhmG75yCu13byU",
  authDomain: "manifestdaily-70c91.firebaseapp.com",
  projectId: "manifestdaily-70c91",
  storageBucket: "manifestdaily-70c91.appspot.com",
  messagingSenderId: "915061718982",
  appId: "1:915061718982:web:baa9786af64f630678bcc7",
  measurementId: "G-4HY968BTZZ",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const db = getFirestore(firebaseApp);

export { firebaseApp, auth, provider, db };
