import { useAuth } from "../contexts/AuthContext"
import { LoginHeader } from "../components/LoginHeader";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export const ResetPassword = () => {

    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [instructions, setInstructions] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await forgotPassword(email);
            setInstructions(true);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="login_container">
            <LoginHeader />

            <div className="sign-in-container">
                <form id="reset-password-form" onSubmit={handleSubmit}>
                    <div className="detail_entry_container">
                        <h2>Password Reset</h2>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <button type="submit">Reset Password</button>
                    </div>
                    <NavLink to="/login" className={"navlink"}>Login</NavLink>
                </form>
                {instructions && (
                    <p>An email will be sent shortly</p>
                )}
            </div>

        </div>
    )
}
