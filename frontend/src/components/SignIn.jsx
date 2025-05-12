import { useState } from 'react';
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import GoogleButton from "react-google-button"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { googleSignIn, fetchCustomJWT } = useAuth();
    const navigate = useNavigate();

    const emailSignIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in:", userCredential);
            await fetchCustomJWT();
            navigate("/");
        } catch (error) {
            console.log("Sign-in error:", error);
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            await fetchCustomJWT();
            navigate("/");
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div className="sign-in-container">
            <form onSubmit={emailSignIn} id="sign-in-form">

                <div className="detail_entry_container">
                    <h2>Log In</h2>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <button type="submit">Sign In</button>
                </div>


            </form>
            <h4>-OR-</h4>
            <GoogleButton onClick={handleGoogleSignIn} />
        </div>
    )
}
