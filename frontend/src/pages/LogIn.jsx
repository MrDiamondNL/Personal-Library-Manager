import SignIn from "../components/SignIn"
import SignUp from "../components/SignUp"
import { useAuth } from "../contexts/AuthContext"
import { useEffect, useState } from "react";
import { LoginHeader } from "../components/LoginHeader";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
    const { currentUser } = useAuth()
    const [signUp, setSignUp] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            console.log(currentUser);
        }
    }, [currentUser]);

    console.log(signUp);

    return (
        <div className="login_container">
            <LoginHeader />

            {!signUp && (
                <>
                    <SignIn />
                    <p className="login-subtext">Want to sign up with email? Click <span className="login-click" onClick={() => setSignUp(!signUp)}>Here</span></p>
                    <p className="login-subtext">Forgot Password? Click <span className="login-click" onClick={() => navigate("/reset_password")}>Here</span></p>
                </>
            )}
            {signUp && (
                <>
                    <SignUp />
                    <p className="login-subtext">Login page click <span className="login-click" onClick={() => setSignUp(!signUp)}>Here</span></p>
                </>

            )}



        </div>
    )
}
