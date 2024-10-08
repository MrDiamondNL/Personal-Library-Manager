import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { emailSignUp } = useAuth();
    const navigate = useNavigate();

    function handleEmailSignUp(e) {
        e.preventDefault();
        emailSignUp(email, password).then((userCredential) => {
            console.log(userCredential);
        }).catch((error) => {
            console.log(error);
        });
        navigate("/");
    }

    return (
        <div className="sign-in-container">
            <form id="sign-up-form" onSubmit={handleEmailSignUp}>
                <div className="detail_entry_container">
                    <h1>Sign Up</h1>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <button type="submit">Sign Up</button>
                </div>

            </form>
        </div>
    )
}
