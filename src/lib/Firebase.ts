import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF0fmj8aAiDJRPtIN-pfMR61melHiTcHk",
  authDomain: "devdynasty-portfolio-25a19.firebaseapp.com",
  projectId: "devdynasty-portfolio-25a19",
  storageBucket: "devdynasty-portfolio-25a19.appspot.com",
  messagingSenderId: "364601191258",
  appId: "1:364601191258:web:3d0082b083ad380d392163",
  measurementId: "G-3R3SGCE51D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  Timestamp,
};