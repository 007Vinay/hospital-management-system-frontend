import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
    const { role } = useAuth();
    return (
        <div
            className="
                w-64
                min-h-screen
                bg-white
                shadow-md
                p-4
            "
        >
            <ul className="space-y-4">
                <li>
                    <Link to="/dashboard" className="text-blue-600">
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link to="/patients" className="text-blue-600">
                        Patients
                    </Link>
                </li>

                <li>
                    {role === "ROLE_ADMIN" && (
                        <Link to="/doctors">Doctors</Link>
                    )}
                </li>

                <li>
                    {(role === "ROLE_ADMIN" || role === "ROLE_DOCTOR") && (
                        <Link to="/appointments">Appointments</Link>
                    )}
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
