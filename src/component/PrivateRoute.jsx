import { Navigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebase"; // Import your Firebase auth instance

const PrivateRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <p>Loading...</p>; // Optionally, you can show a loading spinner
    }

    if (!user) {
        // If the user is not logged in, redirect to the login page
        return <Navigate to="/login" />;
    }

    // If the user is logged in, render the children components
    return children;
};

export default PrivateRoute;
