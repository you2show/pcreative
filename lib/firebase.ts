import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvuaolEs3YKeY3Iko13olH2Rgq2TttKhU",
  authDomain: "ponloecreative.firebaseapp.com",
  projectId: "ponloecreative",
  storageBucket: "ponloecreative.firebasestorage.app",
  messagingSenderId: "691517974757",
  appId: "1:691517974757:web:68871154e96a3ff8cf4c0c",
  measurementId: "G-WDDT8BZEKW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
