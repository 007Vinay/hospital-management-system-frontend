import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../layouts/DashboardLayout";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../api/axiosConfig";

function MyAppointmentsPage() {
    const [activeAppointments, setActiveAppointments] = useState([]);

    const [historyAppointments, setHistoryAppointments] = useState([]);

    const [activeTab, setActiveTab] = useState("current");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActiveAppointments();

        fetchHistoryAppointments();

        // Auto refresh every 5 seconds
        const interval = setInterval(() => {
            fetchActiveAppointments();

            fetchHistoryAppointments();
        }, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const fetchActiveAppointments = async () => {
        try {
            const response = await api.get(
                "/appointments/my-active-appointments"
            );

            setActiveAppointments(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistoryAppointments = async () => {
        try {
            const response = await api.get(
                "/appointments/my-appointment-history"
            );

            setHistoryAppointments(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    const handleDownloadAppointmentPDF = (appointment) => {
        try {
            const doc = new jsPDF();

            // TITLE
            doc.setFontSize(20);

            doc.text("Hospital Appointment Slip", 20, 20);

            // LINE
            doc.line(20, 25, 190, 25);

            // DETAILS
            doc.setFontSize(12);

            let y = 40;

            const addField = (label, value) => {
                doc.text(`${label}: ${value || "N/A"}`, 20, y);

                y += 10;
            };

            addField("Appointment ID", appointment.id);

            addField("Patient Name", appointment.patient?.name);

            addField("Username", appointment.patient?.user?.username);
            addField("Age", appointment.patient?.age);

            addField("Gender", appointment.patient?.gender);

            addField("Disease", appointment.patient?.disease);

            addField("Phone Number", appointment.patient?.phone);

            addField("Doctor Name", appointment.doctor?.name);

            addField(
                "Appointment Date",
                formatDate(appointment.appointmentDate)
            );

            addField("Status", appointment.status);

            // FOOTER
            doc.setFontSize(10);

            doc.text(
                "Please carry this slip during hospital visit.",
                20,
                y + 10
            );

            // SAVE
            doc.save(`appointment-${appointment.id}.pdf`);

            toast.success("Appointment PDF downloaded");
        } catch (error) {
            console.error(error);

            toast.error("Failed to download PDF");
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

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab("current")}
                        className={`
            px-4 py-2 rounded-lg font-medium transition
            ${
                activeTab === "current"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
            }
        `}
                    >
                        Current Bookings
                    </button>

                    <button
                        onClick={() => setActiveTab("history")}
                        className={`
            px-4 py-2 rounded-lg font-medium transition
            ${
                activeTab === "history"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
            }
        `}
                    >
                        History
                    </button>
                </div>

                {activeTab === "current" ? (
                    activeAppointments.length === 0 ? (
                        <p>No active appointments found.</p>
                    ) : (
                        <div className="space-y-4">
                            {activeAppointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="
                            border
                            p-4
                            rounded-lg
                            shadow-sm
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

                                    <button
                                        onClick={() =>
                                            handleDownloadAppointmentPDF(
                                                appointment
                                            )
                                        }
                                        className="
                                mt-4
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-4
                                py-2
                                rounded-lg
                            "
                                    >
                                        Download PDF
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                ) : historyAppointments.length === 0 ? (
                    <p>No appointment history found.</p>
                ) : (
                    <div className="space-y-4">
                        {historyAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="
                            border
                            p-4
                            rounded-lg
                            bg-gray-50
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

                                <button
                                    onClick={() =>
                                        handleDownloadAppointmentPDF(
                                            appointment
                                        )
                                    }
                                    className="
                                mt-4
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                px-4
                                py-2
                                rounded-lg
                            "
                                >
                                    Download PDF
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default MyAppointmentsPage;
