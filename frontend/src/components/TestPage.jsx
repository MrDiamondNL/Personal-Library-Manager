import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";


export default function TestPage() {

    const { getFirebaseToken } = useAuth();

    const [testObject, setTestObject] = useState(null);



    useEffect(() => {
        const fetchData = async () => {
            const idToken = await getFirebaseToken();
            console.log(idToken);
            try {
                console.log("it got to 1");
                const response = await fetch("http://localhost:5000/api/auth/authenticate", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${idToken}`
                    },
                    credentials: 'include'
                });
                console.log("it got to 2");
                console.log(response);
                if (response.ok) {
                    const result = await response.json();
                    setTestObject(result);
                    console.log("it got to 3");
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
