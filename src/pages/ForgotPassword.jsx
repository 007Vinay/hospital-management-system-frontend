import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function ForgotPassword() {
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post("/auth/send-otp", {
                email,
            });

            alert("OTP sent successfully");

            navigate("/verify-otp", {
                state: { email },
            });
        } catch (error) {
            console.error(error);

            alert("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                onSubmit={handleSendOtp}
                className="border p-6 rounded-lg shadow-md w-96"
            >
                <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded"
                >
                    {loading ? "Sending..." : "Send OTP"}
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;
