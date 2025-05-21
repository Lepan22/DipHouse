// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAa_IPmOWZ4-KpWIC7huhhl7mYjYfEJhDk",
  authDomain: "diphouse-control.firebaseapp.com",
  databaseURL: "https://diphouse-control-default-rtdb.firebaseio.com",
  projectId: "diphouse-control",
  storageBucket: "diphouse-control.firebasestorage.app",
  messagingSenderId: "126387069829",
  appId: "1:126387069829:web:7e365252a98da884075aec",
  measurementId: "G-TFRB580278"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, analytics, database, storage };
