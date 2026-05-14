import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="flex">
                <Sidebar />

                <div className="flex-1 p-6">{children}</div>
            </div>
        </div>
    );
}

export default DashboardLayout;
