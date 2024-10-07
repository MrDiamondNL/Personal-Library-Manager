import { Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext"
import { useAuth } from "../contexts/AuthContext";

export const PrivateRoute = () => {

    const { loading, currentUser } = useAuth();

    if (loading) {
        return <div>Loading</div>
    }

    return currentUser ? (
        <Outlet />
    ) : (
        <Navigate to="/login" />
    )
}
