import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // clear login data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");

        // redirect to login page
        navigate("/login", { replace: true });
    },[navigate]);

    return <p className="p-6">Logging out...</p>
};

export default Logout;