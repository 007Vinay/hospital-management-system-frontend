import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UnauthorizedPage from "../pages/UnauthorizedPage";

import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import PatientsPage from "../pages/PatientsPage";
import DoctorsPage from "../pages/DoctorsPage";
import AppointmentsPage from "../pages/AppointmentsPage";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/" element={<Navigate to="/login" />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />

                    <Route path="/patients" element={<PatientsPage />} />

                    <Route
                        path="/appointments"
                        element={<AppointmentsPage />}
                    />
                </Route>

                <Route
                    element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}
                >
                    <Route path="/doctors" element={<DoctorsPage />} />
                </Route>

                <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
