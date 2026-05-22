import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axiosConfig";

function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get("/notifications");

            setNotifications(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <p>Loading notifications...</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div
                className="
                    bg-white
                    p-6
                    rounded-xl
                    shadow-md
                "
            >
                <h1
                    className="
                        text-2xl
                        font-bold
                        mb-6
                    "
                >
                    Notifications
                </h1>

                {notifications.length === 0 ? (
                    <p>No notifications found.</p>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="
                                    border
                                    rounded-lg
                                    p-4
                                    hover:bg-gray-50
                                    transition
                                "
                            >
                                <p
                                    className="
                                        text-gray-800
                                        font-medium
                                    "
                                >
                                    {notification.message}
                                </p>

                                <p
                                    className="
                                        text-sm
                                        text-gray-500
                                        mt-2
                                    "
                                >
                                    {new Date(
                                        notification.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default NotificationsPage;
