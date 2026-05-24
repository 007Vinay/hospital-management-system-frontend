import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import BookAppointmentPage from "../pages/BookAppointmentPage";
import RegisterPage from "../pages/RegisterPage";
import MyProfilePage from "../pages/MyProfilePage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import PatientsPage from "../pages/PatientsPage";
import DoctorsPage from "../pages/DoctorsPage";
import MyAppointmentsPage from "../pages/MyAppointmentsPage";
import ProtectedRoute from "./ProtectedRoute";
import AppointmentsPage from "../pages/AppointmentsPage";
import ForgotPassword from "../pages/ForgotPassword";
import VerifyOtp from "../pages/VerifyOtp";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route path="/verify-otp" element={<VerifyOtp />} />

                <Route element={<ProtectedRoute />}>
                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={["ROLE_ADMIN", "ROLE_DOCTOR"]}
                            />
                        }
                    >
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={["ROLE_ADMIN", "ROLE_DOCTOR"]}
                            />
                        }
                    >
                        <Route path="/patients" element={<PatientsPage />} />
                    </Route>
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />
                        }
                    >
                        <Route path="/doctors" element={<DoctorsPage />} />
                    </Route>

                    <Route
                        element={
                            <ProtectedRoute
                                allowedRoles={["ROLE_ADMIN", "ROLE_DOCTOR"]}
                            />
                        }
                    >
                        <Route
                            path="/appointments"
                            element={<AppointmentsPage />}
                        />
                    </Route>

                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_PATIENT"]} />
                        }
                    >
                        <Route path="/my-profile" element={<MyProfilePage />} />

                        <Route
                            path="/my-appointments"
                            element={<MyAppointmentsPage />}
                        />

                        <Route
                            path="/book-appointment"
                            element={<BookAppointmentPage />}
                        />
                    </Route>
                </Route>

                <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
