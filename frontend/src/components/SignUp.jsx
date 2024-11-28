import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { emailSignUp } = useAuth();
    const [passwordMatch, setPasswordMatch] = useState(null);
    const navigate = useNavigate();

    function handleEmailSignUp(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordMatch(false);
            return;
        }
        emailSignUp(email, password).then((userCredential) => {
            console.log(userCredential);
            navigate("/");
        }).catch((error) => {
            console.log(error);
        });

    }

    return (
        <div className="sign-in-container">
            <form id="sign-up-form" onSubmit={handleEmailSignUp}>
                <div className="detail_entry_container">
                    <h2>Sign Up</h2>
                    <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>
                    <button type="submit">Sign Up</button>
                </div>
            </form>

            {(passwordMatch === false) && (
                <span className="incorrect-password">Passwords do not match, please try again</span>
            )}

        </div>
    )
}
