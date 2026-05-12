import { useNavigate } from "react-router-dom";

function DashboardLayout({ children }) {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("username");

        navigate("/");
    };

    return (

        <div>

            <h1>Hospital Management System</h1>

            <button onClick={handleLogout}>
                Logout
            </button>

            <hr />

            {children}

        </div>
    );
}

export default DashboardLayout;