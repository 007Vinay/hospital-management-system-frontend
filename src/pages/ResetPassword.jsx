import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const location = useLocation();

    const navigate = useNavigate();

    const email = location.state?.email;

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post("/auth/reset-password", {
                email,
                newPassword,
            });

            alert("Password reset successful");

            navigate("/login");
        } catch (error) {
            console.error(error);

            alert("Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                onSubmit={handleResetPassword}
                className="border p-6 rounded-lg shadow-md w-96"
            >
                <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded"
                >
                    {loading ? "Updating..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
