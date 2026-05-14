import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../api/axiosConfig";

function BookAppointmentPage() {
    const [doctors, setDoctors] = useState([]);

    const [doctorId, setDoctorId] = useState("");

    const [appointmentDate, setAppointmentDate] = useState("");

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get("/doctors");

            setDoctors(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post(
                `/appointments?doctorId=${doctorId}`,

                {
                    appointmentDate,
                    status: "PENDING",
                }
            );

            alert("Appointment booked successfully");

            setDoctorId("");

            setAppointmentDate("");
        } catch (error) {
            console.error(error);

            alert("Failed to book appointment");
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                <h1
                    className="
                        text-2xl
                        font-bold
                        mb-6
                    "
                >
                    Book Appointment
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="
                        bg-white
                        p-6
                        rounded-lg
                        shadow-md
                        max-w-md
                    "
                >
                    <div className="mb-4">
                        <label className="block mb-2">Select Doctor</label>

                        <select
                            value={doctorId}
                            onChange={(e) => setDoctorId(e.target.value)}
                            className="
                                w-full
                                border
                                p-2
                                rounded
                            "
                            required
                        >
                            <option value="">Choose Doctor</option>

                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Appointment Date</label>

                        <input
                            type="datetime-local"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="
                                w-full
                                border
                                p-2
                                rounded
                            "
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="
                            bg-blue-600
                            text-white
                            px-4
                            py-2
                            rounded
                        "
                    >
                        Book Appointment
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}

export default BookAppointmentPage;
