import { Link } from "react-router-dom";

function Sidebar() {
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
                    <Link to="/doctors" className="text-blue-600">
                        Doctors
                    </Link>
                </li>

                <li>
                    <Link to="/appointments" className="text-blue-600">
                        Appointments
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;
