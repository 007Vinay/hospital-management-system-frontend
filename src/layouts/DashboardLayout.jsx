import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("username");

        navigate("/");
    };

    return (

        <div>

            <Navbar />

            <Sidebar />

            <button onClick={handleLogout}>
                Logout
            </button>

            <hr />

            {children}

        </div>
    );
}

export default DashboardLayout;