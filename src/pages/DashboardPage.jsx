import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardStats from "../components/DashboardStats";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

function DashboardPage() {
    const [patientsCount, setPatientsCount] = useState(0);

    const [doctorsCount, setDoctorsCount] = useState(0);

    const [appointmentsCount, setAppointmentsCount] = useState(0);

    const [chartData, setChartData] = useState([]);

    const [recentAppointments, setRecentAppointments] = useState([]);

    const [loading, setLoading] = useState(true);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const patientsResponse = await api.get("/patients");

            const doctorsResponse = await api.get("/doctors");

            const appointmentsResponse = await api.get(
                "/appointments?page=0&size=1000"
            );

            const appointmentsData = appointmentsResponse.data.content || [];

            setRecentAppointments(appointmentsData.slice(0, 5));

            const statusCounts = appointmentsData.reduce((acc, appointment) => {
                acc[appointment.status] = (acc[appointment.status] || 0) + 1;

                return acc;
            }, {});

            const formattedChartData = Object.keys(statusCounts).map(
                (status) => ({
                    name: status,
                    value: statusCounts[status],
                })
            );

            setChartData(formattedChartData);

            setPatientsCount(patientsResponse.data.length);

            setDoctorsCount(doctorsResponse.data.length);

            setAppointmentsCount(appointmentsResponse.data.totalElements);

            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6B7280"];

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "SCHEDULED":
                return "bg-blue-100 text-blue-700";

            case "COMPLETED":
                return "bg-green-100 text-green-700";

            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            case "REJECTED":
                return "bg-gray-200 text-gray-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <DashboardLayout>
            {loading ? (
                <div
                    className="
                        flex
                        justify-center
                        items-center
                        h-[70vh]
                        text-2xl
                        font-bold
                        text-blue-600
                    "
                >
                    Loading dashboard...
                </div>
            ) : (
                <>
                    <div
                        className="
                        bg-gradient-to-r
                        from-blue-600
                        to-indigo-700
                        text-white
                        p-8
                        rounded-2xl
                        shadow-lg
                        mb-8
                    "
                    >
                        <h1
                            className="
                            text-4xl
                            font-bold
                            mb-3
                        "
                        >
                            Welcome to HMS Dashboard
                        </h1>

                        <p
                            className="
                            text-lg
                            text-blue-100
                            mb-6
                        "
                        >
                            Manage patients, doctors, and appointments
                            efficiently.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/patients"
                                className="
                                bg-white
                                text-blue-700
                                px-5
                                py-2
                                rounded-lg
                                font-semibold
                                hover:bg-blue-100
                                transition
                            "
                            >
                                Manage Patients
                            </Link>

                            <Link
                                to="/doctors"
                                className="
                                bg-white
                                text-green-700
                                px-5
                                py-2
                                rounded-lg
                                font-semibold
                                hover:bg-green-100
                                transition
                            "
                            >
                                Manage Doctors
                            </Link>

                            <Link
                                to="/appointments"
                                className="
                                bg-white
                                text-purple-700
                                px-5
                                py-2
                                rounded-lg
                                font-semibold
                                hover:bg-purple-100
                                transition
                            "
                            >
                                Manage Appointments
                            </Link>
                        </div>
                    </div>

                    <div
                        className="
                                grid
                                grid-cols-1
                                md:grid-cols-3
                                gap-6
                            "
                    >
                        <DashboardStats
                            title="Total Patients"
                            value={patientsCount}
                            color="bg-blue-500"
                        />

                        <DashboardStats
                            title="Total Doctors"
                            value={doctorsCount}
                            color="bg-green-500"
                        />

                        <DashboardStats
                            title="Appointments"
                            value={appointmentsCount}
                            color="bg-purple-500"
                        />
                    </div>
                    <div
                        className="
                        bg-white
                        p-6
                        rounded-xl
                        shadow-md
                        mt-8
                    "
                    >
                        <h2
                            className="
                                    text-xl
                                    font-bold
                                    mb-6
                                "
                        >
                            Appointments Overview
                        </h2>

                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={140}
                                        label
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip />

                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div
                            className="
                            bg-white
                            p-6
                            rounded-xl
                            shadow-md
                            mt-8
                        "
                        >
                            <h2
                                className="
                                text-xl
                                font-bold
                                mb-6
                            "
                            >
                                Recent Appointments
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 border">
                                                Patient
                                            </th>

                                            <th className="p-3 border">
                                                Doctor
                                            </th>

                                            <th className="p-3 border">Date</th>

                                            <th className="p-3 border">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentAppointments.length > 0 ? (
                                            recentAppointments.map(
                                                (appointment) => (
                                                    <tr
                                                        key={appointment.id}
                                                        className="
                                                                hover:bg-gray-50
                                                            "
                                                    >
                                                        <td className="p-3 border">
                                                            {
                                                                appointment.patientName
                                                            }
                                                        </td>

                                                        <td className="p-3 border">
                                                            {
                                                                appointment.doctorName
                                                            }
                                                        </td>

                                                        <td className="p-3 border">
                                                            {formatDate(
                                                                appointment.appointmentDate
                                                            )}
                                                        </td>

                                                        <td className="p-3 border">
                                                            <span
                                                                className={`
                                                                            px-3
                                                                            py-1
                                                                            rounded-full
                                                                            text-sm
                                                                            font-semibold
                                                                            ${getStatusBadge(appointment.status)}
                                                                        `}
                                                            >
                                                                {
                                                                    appointment.status
                                                                }
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="
                                                            text-center
                                                            p-6
                                                            text-gray-500
                                                            font-medium
                                                        "
                                                >
                                                    No recent appointments found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}

export default DashboardPage;
