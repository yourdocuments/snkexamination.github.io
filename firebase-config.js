// ============================================================
// SNK IT Institute - Firebase Configuration
// Step 3.5
// Project: snkexamination
// ============================================================

// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

// Firebase Authentication
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firebase Firestore
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ============================================================
// Firebase Configuration
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyBInbSGmGGZ6yIS0gYb4rVFaH7E5cOSPwA",
  authDomain: "snkexamination.firebaseapp.com",
  projectId: "snkexamination",
  storageBucket: "snkexamination.firebasestorage.app",
  messagingSenderId: "632676592585",
  appId: "1:632676592585:web:0fb0d8f0ac3d92bc739618",
  measurementId: "G-HEWT99CHXK"
};

// ============================================================
// Initialize Firebase
// ============================================================

const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Firestore Database
const db = getFirestore(app);

// ============================================================
// Export
// ============================================================

export {
  app,
  auth,
  db
};
```
