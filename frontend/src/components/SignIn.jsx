import { useEffect, useState } from 'react';
import { auth } from "../firebase";
import { signInWithEmailAndPassword, getRedirectResult } from "firebase/auth";
import GoogleButton from "react-google-button"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { googleSignIn, } = useAuth();
    const navigate = useNavigate();


    const emailSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
            }).catch((error) => {
                console.log(error);
            });
        navigate("/");
    }

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
            navigate("/");
        } catch (error) {
            console.log(error);
        }

    }

    // useEffect(() => {
    //     const checkRedirectResult = async () => {
    //         try {
    //             const result = await getRedirectResult(auth);
    //             if (result) {
    //                 navigate("/");
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };

    //     checkRedirectResult();
    // }, [navigate]);

    return (
        <div className="sign-in-container">
            <form onSubmit={emailSignIn} id="sign-in-form">

                <div className="detail_entry_container">
                    <h1>Log In</h1>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <button type="submit">Login</button>
                </div>


            </form>
            <GoogleButton onClick={handleGoogleSignIn} />
        </div>
    )
}
