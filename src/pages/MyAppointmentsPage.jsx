import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../api/axiosConfig";

function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get("/appointments/my-appointments");

            setAppointments(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <p>Loading appointments...</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div
                className="
                    bg-white
                    p-6
                    rounded-lg
                    shadow
                "
            >
                <h1
                    className="
                        text-2xl
                        font-bold
                        mb-6
                    "
                >
                    My Appointments
                </h1>

                {appointments.length === 0 ? (
                    <p>No appointments found.</p>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="
                                    border
                                    p-4
                                    rounded
                                "
                            >
                                <p>
                                    <strong>Doctor:</strong>{" "}
                                    {appointment.doctor?.name}
                                </p>

                                <p>
                                    <strong>Date:</strong>{" "}
                                    {appointment.appointmentDate}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    {appointment.status}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default MyAppointmentsPage;
