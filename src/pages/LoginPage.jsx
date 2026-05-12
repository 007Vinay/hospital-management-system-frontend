import api from "../api/axiosConfig";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

    e.preventDefault();

    try {

        const response = await api.post(
            "/auth/login",
            {
                username,
                password
            }
        );

        localStorage.setItem(
    "token",
    response.data.token
);

localStorage.setItem(
    "username",
    response.data.username
);

navigate("/dashboard");

    } catch (error) {

        console.error(error);
    }
};
    return (

        <div>

            <h2>Login Page</h2>

            <form onSubmit={handleLogin}>

                <div>

                    <label>Username:</label>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)}
                    />
                </div>

                <br />

                <div>

                    <label>Password:</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)}
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}

export default LoginPage;