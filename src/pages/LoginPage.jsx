import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await api.post("/auth/login", formData);

            const data = response.data;

            login(data.token, data.username, data.role, data.userId);

            if (data.role === "ROLE_PATIENT") {
                navigate("/my-profile");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);

            alert("Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <p
                            className="text-sm text-blue-600 cursor-pointer mt-2"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot Password?
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p
                    className="
                            text-center
                            mt-4
                        "
                >
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="
                                text-blue-600
                                font-semibold
                            "
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
