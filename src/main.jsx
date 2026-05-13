import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ToastContainer />
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
