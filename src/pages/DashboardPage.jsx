import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardStats from "../components/DashboardStats";

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

    const fetchDashboardStats = async () => {
        try {
            const patientsResponse = await api.get("/patients");

            const doctorsResponse = await api.get("/doctors");

            const appointmentsResponse = await api.get(
                "/appointments?page=0&size=1000"
            );

            const appointments = appointmentsResponse.data.content || [];

            setRecentAppointments(appointments.slice(0, 5));

            const statusCounts = appointments.reduce((acc, appointment) => {
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

    return (
        <DashboardLayout>
            <h1
                className="
                    text-3xl
                    font-bold
                    mb-6
                "
            >
                Dashboard
            </h1>

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
                                        fill={COLORS[index % COLORS.length]}
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
                                    <th className="p-3 border">Patient</th>

                                    <th className="p-3 border">Doctor</th>

                                    <th className="p-3 border">Date</th>

                                    <th className="p-3 border">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentAppointments.map((appointment) => (
                                    <tr
                                        key={appointment.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="p-3 border">
                                            {appointment.patientName}
                                        </td>

                                        <td className="p-3 border">
                                            {appointment.doctorName}
                                        </td>

                                        <td className="p-3 border">
                                            {formatDate(
                                                appointment.appointmentDate
                                            )}
                                        </td>

                                        <td className="p-3 border">
                                            {appointment.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default DashboardPage;
