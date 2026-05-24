import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function VerifyOtp() {
    const [otp, setOtp] = useState("");

    const [loading, setLoading] = useState(false);

    const location = useLocation();

    const navigate = useNavigate();

    const email = location.state?.email;

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post("/auth/verify-otp", {
                email,
                otp,
            });

            alert("OTP verified successfully");
            navigate("/reset-password", {
                state: { email },
            });
        } catch (error) {
            console.error(error);

            alert("Invalid or expired OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                onSubmit={handleVerifyOtp}
                className="border p-6 rounded-lg shadow-md w-96"
            >
                <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded"
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
        </div>
    );
}

export default VerifyOtp;
