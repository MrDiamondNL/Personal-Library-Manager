import { useContext, useState, createContext, useEffect } from 'react';
import { auth } from "../firebase"
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from "firebase/auth";

// eslint-disable-next-line no-undef
const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurentUser] = useState();
    const [loading, setLoading] = useState(true);
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    }

    const emailSignUp = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurentUser(user);
            console.log(currentUser);
            setLoading(false);
            // navigate('/')
        });
        return unsubscribe
    }, []);



    const value = {
        currentUser,
        googleSignIn,
        emailSignUp,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
