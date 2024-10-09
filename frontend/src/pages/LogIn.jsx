import SignIn from "../components/SignIn"
import SignUp from "../components/SignUp"
import { useAuth } from "../contexts/AuthContext"
import { useEffect } from "react";

export default function LogIn() {
    const { currentUser } = useAuth()

    useEffect(() => {
        if (currentUser) {
            console.log(currentUser);
        }
    }, [currentUser]);


    return (
        <div className="login_container">
            <h1>Personal Library Manager</h1>
            <SignIn />
            <SignUp />
        </div>
    )
}
