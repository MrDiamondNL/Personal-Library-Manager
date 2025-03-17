import { useState, useEffect, useContext } from "react";
//import { useAuth } from "../contexts/AuthContext";
import { CustomFetchContext } from "../contexts/CustomFetchContext";


export default function TestPage() {

    //const { getFirebaseToken } = useAuth();
    const { customFetch } = useContext(CustomFetchContext);
    const [testObject, setTestObject] = useState(null);

    useEffect(() => {
        const fetchData = async () => {

            const url = "http://localhost:5000/api/auth/authenticate";
            try {
                const response = await customFetch(url);
                setTestObject(response);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div>
                {testObject ? JSON.stringify(testObject) : "Loading..."}
            </div>
        </div>
    )
}
