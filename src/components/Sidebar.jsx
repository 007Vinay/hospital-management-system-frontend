import { Link } from "react-router-dom";

function Sidebar() {

    return (

        <div>

            <ul>

                <li>
                    <Link to="/dashboard">
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link to="/patients">
                        Patients
                    </Link>
                </li>

                <li>
                    <Link to="/doctors">
                        Doctors
                    </Link>
                </li>

                <li>
                    <Link to="/appointments">
                        Appointments
                    </Link>
                </li>

            </ul>

        </div>
    );
}

export default Sidebar;