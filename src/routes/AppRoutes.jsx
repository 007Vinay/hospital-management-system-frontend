import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import BookAppointmentPage from "../pages/BookAppointmentPage";
import ProtectedRoute from "../components/ProtectedRoute";
import RegisterPage from "../pages/RegisterPage";
import MyProfilePage from "../pages/MyProfilePage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import PatientsPage from "../pages/PatientsPage";
import DoctorsPage from "../pages/DoctorsPage";
import MyAppointmentsPage from "../pages/MyAppointmentsPage";
import AppointmentsPage from "../pages/AppointmentsPage";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={<Navigate to="/login" />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/my-profile" element={<MyProfilePage />} />

                    <Route path="/dashboard" element={<DashboardPage />} />

                    <Route path="/patients" element={<PatientsPage />} />

                    <Route
                        path="/my-appointments"
                        element={<MyAppointmentsPage />}
                    />
                    <Route
                        path="/appointments"
                        element={<AppointmentsPage />}
                    />
                </Route>
                <Route
                    path="/book-appointment"
                    element={<BookAppointmentPage />}
                />

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
