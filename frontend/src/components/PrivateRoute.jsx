import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSpinner } from "./LoadingSpinner";

export const PrivateRoute = () => {

    const { loading, currentUser } = useAuth();

    if (loading) {
        return (
            <LoadingSpinner />
        );
    }

    return currentUser ? (
        <Outlet />
    ) : (
        <Navigate to="/login" />
    )
}
