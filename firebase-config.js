/* eslint-disable react-hooks/rules-of-hooks */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvhts-AOi7CMlm2AKYoC1Elt86EiaBaPI",
  authDomain: "start-with-five.firebaseapp.com",
  projectId: "start-with-five",
  storageBucket: "start-with-five.appspot.com",
  messagingSenderId: "32346469531",
  appId: "1:32346469531:web:75dee733089089ef67423e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app);
// export const provider = new GoogleAuthProvider();
