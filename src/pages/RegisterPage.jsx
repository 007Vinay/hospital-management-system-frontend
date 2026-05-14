import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import api from "../api/axiosConfig";

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        age: "",
        gender: "",
        disease: "",
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/auth/register", formData);

            alert("Registration successful");

            navigate("/");
        } catch (error) {
            console.error(error);

            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gray-100
            "
        >
            <div
                className="
                    bg-white
                    p-8
                    rounded-lg
                    shadow-md
                    w-full
                    max-w-md
                "
            >
                <h2
                    className="
                        text-2xl
                        font-bold
                        mb-6
                        text-center
                    "
                >
                    Patient Registration
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="
                            w-full
                            border
                            p-2
                            rounded
                        "
                        required
                    />

                    <div className="flex">
                        <div
                            className="
            px-3
            flex
            items-center
            border
            border-r-0
            rounded-l
            bg-gray-100
        "
                        >
                            +91
                        </div>

                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter 10 digit number"
                            value={formData.phone}
                            onChange={(e) => {
                                const value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 10);

                                setFormData({
                                    ...formData,
                                    phone: value,
                                });
                            }}
                            className="
                                    w-full
                                    border
                                    p-2
                                    rounded-r
                                "
                            required
                        />
                    </div>

                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                        className="
                            w-full
                            border
                            p-2
                            rounded
                        "
                        required
                    />

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="
                            w-full
                            border
                            p-2
                            rounded
                        "
                        required
                    >
                        <option value="">Select Gender</option>

                        <option value="Male">Male</option>

                        <option value="Female">Female</option>
                    </select>

                    <input
                        type="text"
                        name="disease"
                        placeholder="Disease"
                        value={formData.disease}
                        onChange={handleChange}
                        className="
                            w-full
                            border
                            p-2
                            rounded
                        "
                        required
                    />

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="
                            w-full
                            border
                            p-2
                            rounded
                        "
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="
                            w-full
                            border
                            p-2
                            rounded
                        "
                        required
                    />

                    <button
                        type="submit"
                        className="
                            w-full
                            bg-blue-600
                            text-white
                            p-2
                            rounded
                            hover:bg-blue-700
                        "
                    >
                        Register
                    </button>
                </form>

                <p
                    className="
                        text-center
                        mt-4
                    "
                >
                    Already have an account?{" "}
                    <Link
                        to="/"
                        className="
                            text-blue-600
                            font-semibold
                        "
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
