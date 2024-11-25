import { Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './src/config/firebaseConfig';

export const register = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", userCredential.user);
        return true;
    } 
    catch (error) {
        console.error("Error during registration:", error.message);
        Alert.alert("Register Gagal!", error.message);
        return false;
    }
};

export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
        return true;
    } 
    catch (error) {
        console.error("Error during login:", error.message);
        return false;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
    } 
    catch (error) {
        console.error("Error during logout:", error.message);
    }
};