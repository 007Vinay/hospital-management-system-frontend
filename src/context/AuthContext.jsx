import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const [username, setUsername] = useState(
        localStorage.getItem("username") || ""
    );

    const login = (jwtToken, user) => {
        localStorage.setItem("token", jwtToken);

        localStorage.setItem("username", user);

        setToken(jwtToken);

        setUsername(user);
    };

    const logout = () => {
        localStorage.removeItem("token");

        localStorage.removeItem("username");

        setToken("");

        setUsername("");
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                username,
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
