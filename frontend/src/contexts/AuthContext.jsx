/* eslint-disable react/prop-types */
import { useContext, useState, createContext, useEffect } from 'react';
import { auth } from "../firebase"
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
} from "firebase/auth";

// eslint-disable-next-line no-undef
const AuthContext = createContext();


export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const [customToken, setCustomToken] = useState();

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    const emailSignUp = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(error);
        }
    }

    const logOut = async () => {
        return signOut(auth);
    }

    const forgotPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.log(error);
        }
    }

    const getFirebaseToken = async () => {
        const user = auth.currentUser;
        if (user) {
            return await user.getIdToken();
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe
    }, []);



    const value = {
        currentUser,
        googleSignIn,
        emailSignUp,
        loading,
        logOut,
        forgotPassword,
        getFirebaseToken
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
