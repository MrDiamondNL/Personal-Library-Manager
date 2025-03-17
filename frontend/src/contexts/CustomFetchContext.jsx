import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


export const CustomFetchContext = createContext();

export const CustomFetchProvider = ({ children }) => {

    const { getFirebaseToken } = useAuth();
    const navigate = useNavigate();

    const customFetch = async (url, options = {}) => {
        const idToken = await getFirebaseToken();
        const defaultOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`
            },
            credentials: 'include'
        };

        const fetchOptions = {
            ...defaultOptions,
            ...options
        };

        try {
            const response = await fetch(url, fetchOptions);
            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                //console.log("No Response received");
                if (response.status === 401) {
                    navigate("/login");
                    throw new Error("Unauthorized - Redirecting to login");
                }

                const errorData = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorData}`);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            throw err;
        }
    }

    return (
        <CustomFetchContext.Provider value={{ customFetch }}>
            {children}
        </CustomFetchContext.Provider>
    )
}