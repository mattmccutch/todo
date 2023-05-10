// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";

import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC3oGtQfFFqsDr45xUORfyM5p3v4sgSi4s",
    authDomain: "todo-3ae0e.firebaseapp.com",
    projectId: "todo-3ae0e",
    storageBucket: "todo-3ae0e.appspot.com",
    messagingSenderId: "156366314096",
    appId: "1:156366314096:web:228a7bcf70cc0071eab2b5",
    measurementId: "G-2BNS8CVRNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length == 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.err(err);
        alert(err.message);
    }
}

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        })
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordReset(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err.message)
    }
}

const logout = () => {
    signOut(auth);
}

export {
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
};