import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const PrivateRoute = () => {

    const { loading, currentUser } = useAuth();

    if (loading) {
        return <div>Loading</div>
    }
    console.log(currentUser);

    return currentUser ? (
        <Outlet />
    ) : (
        <Navigate to="/login" />
    )
}
