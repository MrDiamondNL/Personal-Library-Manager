import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASEAPP_ID
}

// const firebaseConfig = {
//     apiKey: "AIzaSyBNvicvymKiLbe3lr-WS91j3B2oAR-pkeg",
//     authDomain: "auth-development-30061.firebaseapp.com",
//     projectId: "auth-development-30061",
//     storageBucket: "auth-development-30061.appspot.com",
//     messagingSenderId: "254266554158",
//     appId: "1:254266554158:web:3f4ac80a442eccd54aacbf"
//   };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);