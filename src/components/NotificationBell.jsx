import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import api from "../api/axiosConfig";

function NotificationBell() {
    const [notifications, setNotifications] = useState([]);

    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/notifications");

            setNotifications(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* BELL ICON */}

            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative"
            >
                <Bell size={24} />

                {/* BADGE */}

                {notifications.length > 0 && (
                    <span
                        className="
                            absolute
                            -top-2
                            -right-2
                            bg-red-500
                            text-white
                            text-xs
                            rounded-full
                            px-2
                            py-0.5
                        "
                    >
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* DROPDOWN */}

            {showDropdown && (
                <div
                    className="
                        absolute
                        right-0
                        mt-3
                        w-80
                        bg-white
                        shadow-xl
                        rounded-xl
                        border
                        z-50
                        max-h-96
                        overflow-y-auto
                    "
                >
                    <div
                        className="
                            p-4
                            border-b
                            font-bold
                        "
                    >
                        Notifications
                    </div>

                    {notifications.length === 0 ? (
                        <div className="p-4 text-gray-500">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="
                                    p-4
                                    border-b
                                    hover:bg-gray-50
                                "
                            >
                                <p
                                    className="
                                            text-sm
                                            text-gray-600
                                            font-medium
                                        "
                                >
                                    {notification.message}
                                </p>

                                <p
                                    className="
                                        text-xs
                                        text-gray-500
                                        mt-1
                                    "
                                >
                                    {new Date(
                                        notification.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
