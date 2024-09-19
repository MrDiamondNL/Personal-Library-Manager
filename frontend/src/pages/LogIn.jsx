import SignIn from "../components/SignIn"
import SignUp from "../components/SignUp"
import { AuthProvider } from "../contexts/AuthContext"

export default function LogIn() {
    return (
        <>
            <SignIn />
            <SignUp />
        </>

    )
}
