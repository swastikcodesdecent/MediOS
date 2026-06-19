// MediOS - Firebase Integration Configuration and Exports
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Config provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyDmVUBsIh5HyNxwDfHtuFx2-Vs6YEpB2ek",
  authDomain: "medios-ae9f9.firebaseapp.com",
  projectId: "medios-ae9f9",
  storageBucket: "medios-ae9f9.firebasestorage.app",
  messagingSenderId: "22875903886",
  appId: "1:22875903886:web:e151d0c10502903ccef6df"
};

// Initialize Primary Firebase Application
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Creates a user account in Auth using a secondary app instance.
 * This prevents Firebase from logging out the current admin session
 * when registering a new staff member (doctor/receptionist).
 */
async function createStaffAuthAccount(email, password) {
  let secondaryApp;
  try {
    secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
  } catch (err) {
    secondaryApp = getApp("SecondaryApp");
  }

  const secondaryAuth = getAuth(secondaryApp);

  // Create user using secondary auth instance
  const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  const newUser = userCredential.user;

  // Sign out the secondary instance immediately to prevent state pollution
  await signOut(secondaryAuth);

  return newUser;
}

// Pre-configured system-wide GROQ Cloud API Key for AI Clinical Suggestions
// Replace this with your actual GROQ API key (starts with gsk_...)
const GROQ_API_KEY = "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";

export {
  app,
  db,
  auth,
  createStaffAuthAccount,
  GROQ_API_KEY,
  // Re-export common Firestore methods for convenience in pages
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  onSnapshot,
  serverTimestamp
};
