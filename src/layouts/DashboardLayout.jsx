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
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="flex">
                <Sidebar />

                <div className="flex-1 p-6">
                    <button
                        onClick={handleLogout}
                        className="
                        bg-red-500
                        text-white
                        px-4
                        py-2
                        rounded
                        mb-4
                    "
                    >
                        Logout
                    </button>

                    {children}
                </div>
            </div>
        </div>
    );
}

export default DashboardLayout;
