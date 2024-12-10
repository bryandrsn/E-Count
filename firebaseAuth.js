import { Alert } from 'react-native';
import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './src/config/firebaseConfig';
import { doc, setDoc, getDoc} from 'firebase/firestore'
import { db } from './src/config/firebaseConfig';

const createUserDB = async (id, email) => {
    try {
        const docRef = doc(db, "accounts", id);
        await setDoc(docRef, {
            name: "",
            email: email,
            address: "",
            phone: "",
            role: "worker",
            verified: false,
        });
    }
    catch (error) {
        console.error("Error during registration to database:", error.message);
        Alert.alert("Register Gagal!", error.message);
    }
};

const readUserDB = async (id) => {
    try {
        const docRef = doc(db, "accounts", id);
        const fetchData = await getDoc(docRef);
        const result = {
            role: fetchData.data().role,
            verified: fetchData.data().verified
        }
        return result
    }
    catch (error) {
        console.error("Error during login to database:", error.message);
        Alert.alert("Login Gagal!", error.message);
    }

};

export const register = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", userCredential.user);
        createUserDB(userCredential.user.uid, userCredential.user.email);
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
        const readResult = await readUserDB(userCredential.user.uid);
        const loginKey = {
            ...readResult,
            isLoggedIn: true,
        }
        return loginKey
    }
    catch (error) {
        console.error("Error during login:", error.message);
        return {isLoggedIn: false}
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