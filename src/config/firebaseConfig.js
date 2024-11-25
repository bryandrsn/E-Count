import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAEBCT6t0PaIMgyIoI9ey-yFHwvtaoxZ9E",
    authDomain: "ecountfb.firebaseapp.com",
    projectId: "ecountfb",
    storageBucket: "ecountfb.firebasestorage.app",
    messagingSenderId: "715580880161",
    appId: "1:715580880161:web:48b6fbd3f1a8e354a5fa60",
    measurementId: "G-EVL290WMV3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);