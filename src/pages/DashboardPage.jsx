import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardStats from "../components/DashboardStats";

import api from "../api/axiosConfig";

function DashboardPage() {
    const [patientsCount, setPatientsCount] = useState(0);

    const [doctorsCount, setDoctorsCount] = useState(0);

    const [appointmentsCount, setAppointmentsCount] = useState(0);

    const fetchDashboardStats = async () => {
        try {
            const patientsResponse = await api.get("/patients");

            const doctorsResponse = await api.get("/doctors");

            const appointmentsResponse = await api.get("/appointments");

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
        </DashboardLayout>
    );
}

export default DashboardPage;
