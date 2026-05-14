import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const [username, setUsername] = useState(
        localStorage.getItem("username") || ""
    );

    const [role, setRole] = useState(localStorage.getItem("role") || "");

    const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

    const login = (jwtToken, user, userRole, id) => {
        localStorage.setItem("token", jwtToken);

        localStorage.setItem("username", user);

        setToken(jwtToken);

        setUsername(user);

        localStorage.setItem("role", userRole);

        localStorage.setItem("userId", id);

        setRole(userRole);

        setUserId(id);
    };

    const logout = () => {
        localStorage.removeItem("token");

        localStorage.removeItem("username");

        setToken("");

        setUsername("");

        localStorage.removeItem("role");

        localStorage.removeItem("userId");

        setRole("");

        setUserId("");
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                username,
                role,
                userId,
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
