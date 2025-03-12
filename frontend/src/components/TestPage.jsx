import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";


export default function TestPage() {

    const { getFirebaseToken } = useAuth();

    const [testObject, setTestObject] = useState(null);



    useEffect(() => {
        const fetchData = async () => {
            const idToken = await getFirebaseToken();
            try {
                const response = await fetch("http://localhost:5000/api/auth/authenticate", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${idToken}`
                    },
                    credentials: 'include'
                });
                if (response.ok) {
                    const result = await response.json();
                    setTestObject(result);
                } else {
                    console.log("No Response received");
                }
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
