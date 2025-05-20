// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase, ref, push, update, remove, onValue
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import {
  getStorage, ref as sRef, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAa_IPmOWZ4-KpWIC7huhhl7mYjYfEJhDk",
  authDomain: "diphouse-control.firebaseapp.com",
  databaseURL: "https://diphouse-control-default-rtdb.firebaseio.com",
  projectId: "diphouse-control",
  storageBucket: "diphouse-control.appspot.com",
  messagingSenderId: "126387069829",
  appId: "1:126387069829:web:7e365252a98da884075aec"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export {
  db, ref, push, update, remove, onValue,
  storage, sRef, uploadBytes, getDownloadURL, deleteObject
};
