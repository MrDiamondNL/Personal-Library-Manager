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
const AUTHENTICATOR_API_URL = import.meta.env.VITE_BACKEND_API_URL + "api/auth/authenticate";

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

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

    const fetchCustomJWT = async () => {
        const idToken = await getFirebaseToken();
        try {
            const response = await fetch(AUTHENTICATOR_API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`
                },
                credentials: "include"
            });
            if (response.ok) {
                const result = await response.json();
            } else {
                console.log("No Response received");
            }
        } catch (error) {
            console.log(error);
        }
    };

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
        getFirebaseToken,
        fetchCustomJWT
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
