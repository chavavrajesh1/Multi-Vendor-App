import type { JSX } from "react";
import { getUser } from "../store/auth.store";
import { Navigate } from "react-router-dom";


const RoleRoute = ({
    children,
    role,
}:{
    children : JSX.Element;
    role: string;
}) => {
    const user = getUser();

    if (!user || user.role !== role) {
        return <Navigate to = "/"/>;
    }

    return children;
}

export default RoleRoute;