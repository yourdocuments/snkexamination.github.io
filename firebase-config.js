import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBInbSGmGGZ6yIS0gYb4rVFaH7E5cOSPwA",
  authDomain: "snkexamination.firebaseapp.com",
  projectId: "snkexamination",
  storageBucket: "snkexamination.firebasestorage.app",
  messagingSenderId: "632676592585",
  appId: "1:632676592585:web:0fb0d8f0ac3d92bc739618",
  measurementId: "G-HEWT99CHXK"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export {
  app,
  auth,
  db
};
