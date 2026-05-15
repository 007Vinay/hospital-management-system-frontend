import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {
    const { token, role } = useAuth();

    //User not logged in
    if (!token) {
        return <Navigate to="/" />;
    }

    //Role not authorized
    if (allowedRoles && !allowedRoles.includes(role)) {
        alert("403 Unauthorized");

        return <Navigate to="/dashboard" />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
