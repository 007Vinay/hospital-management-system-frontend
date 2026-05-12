import { useState } from "react";

function LoginPage() {

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const handleLogin = (e) => {

        e.preventDefault();

        console.log({
            username,
            password
        });
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