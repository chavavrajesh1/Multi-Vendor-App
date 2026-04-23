import { Navigate } from "react-router-dom";
import { getToken } from "../store/auth.store"
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = getToken();

    if (!token) {
        return <Navigate to="/login" replace/>;
    }

    return children;
}

export default ProtectedRoute;