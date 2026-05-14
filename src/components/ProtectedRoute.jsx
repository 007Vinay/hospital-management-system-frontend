import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {
    const { token, role } = useAuth();

    // User not logged in
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Role not authorized
    if (allowedRoles && !allowedRoles.includes(role)) {
        alert("403 Unauthorized Access");
        return <Navigate to="/dashboard" />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
