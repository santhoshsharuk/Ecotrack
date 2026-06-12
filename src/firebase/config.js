import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA64DGqwodFs8kSVGYzQ3G1ex0oyyFljwM",
    authDomain: "eco-track-19510.firebaseapp.com",
    projectId: "eco-track-19510",
    storageBucket: "eco-track-19510.firebasestorage.app",
    messagingSenderId: "668413593152",
    appId: "1:668413593152:web:07c3adc96f5eca9b31c1a5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);