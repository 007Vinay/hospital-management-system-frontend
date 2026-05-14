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
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
