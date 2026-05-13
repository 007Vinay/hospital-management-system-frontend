import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const [username, setUsername] = useState(
        localStorage.getItem("username") || ""
    );

    const [role, setRole] = useState(localStorage.getItem("role") || "");

    const login = (jwtToken, user, userRole) => {
        localStorage.setItem("token", jwtToken);

        localStorage.setItem("username", user);

        setToken(jwtToken);

        setUsername(user);

        localStorage.setItem("role", userRole);

        setRole(userRole);
    };

    const logout = () => {
        localStorage.removeItem("token");

        localStorage.removeItem("username");

        setToken("");

        setUsername("");

        localStorage.removeItem("role");

        setRole("");
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                username,
                role,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
