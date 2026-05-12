import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardStats from "../components/DashboardStats";

import api from "../api/axiosConfig";

function DashboardPage() {
    const [patientsCount, setPatientsCount] = useState(0);

    const fetchPatientsCount = async () => {
        try {
            const response = await api.get("/patients");

            setPatientsCount(response.data.length);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPatientsCount();
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
                    value="0"
                    color="bg-green-500"
                />

                <DashboardStats
                    title="Appointments"
                    value="0"
                    color="bg-purple-500"
                />
            </div>
        </DashboardLayout>
    );
}

export default DashboardPage;
