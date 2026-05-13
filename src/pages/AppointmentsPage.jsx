import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../api/axiosConfig";

import { toast } from "react-toastify";

import ConfirmModal from "../components/ConfirmModal";

function AppointmentsPage() {
    const [appointments, setAppointments] = useState([]);

    const [patients, setPatients] = useState([]);

    const [doctors, setDoctors] = useState([]);

    const [editingAppointmentId, setEditingAppointmentId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const [formData, setFormData] = useState({
        patientId: "",

        doctorId: "",

        appointmentDate: "",
    });

    const fetchAppointments = async () => {
        try {
            const response = await api.get("/appointments");

            console.log("Appointments API:", response.data);

            console.log(response.data);

            setAppointments(
                Array.isArray(response.data.content)
                    ? response.data.content
                    : []
            );
        } catch (error) {
            console.error(error);

            toast.error("Failed to fetch appointments");
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await api.get("/patients");

            setPatients(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await api.get("/doctors");

            setDoctors(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAppointments();

        fetchPatients();

        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,

            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(formData);

            if (editingAppointmentId) {
                await api.put(
                    `/appointments/${editingAppointmentId}`,

                    {
                        appointmentDate: formData.appointmentDate,

                        status: "SCHEDULED",
                    }
                );

                toast.success("Appointment updated successfully");
            } else {
                await api.post(
                    `/appointments?patientId=${formData.patientId}&doctorId=${formData.doctorId}`,

                    {
                        appointmentDate: formData.appointmentDate,

                        status: "SCHEDULED",
                    }
                );

                toast.success("Appointment created successfully");
            }

            fetchAppointments();

            setFormData({
                patientId: "",

                doctorId: "",

                appointmentDate: "",
            });

            setEditingAppointmentId(null);
        } catch (error) {
            console.error(error);

            console.log(error.response?.data);

            toast.error("Appointment creation failed");
        }
    };

    const openDeleteModal = (id) => {
        setSelectedAppointmentId(id);

        setIsModalOpen(true);
    };
    const handleDeleteAppointment = async (id) => {
        try {
            await api.delete(`/appointments/${id}`);

            fetchAppointments();

            toast.success("Appointment deleted successfully");
        } catch (error) {
            console.error(error);

            toast.error("Delete failed");
        }
    };

    const handleEditAppointment = (appointment) => {
        setFormData({
            patientId: "",

            doctorId: "",

            appointmentDate: appointment.appointmentDate?.slice(0, 16),
        });

        setEditingAppointmentId(appointment.id);
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
                Appointments
            </h1>

            <form
                onSubmit={handleSubmit}
                className="
                    bg-white
                    p-6
                    rounded
                    shadow-md
                    mb-6
                    space-y-4
                "
            >
                <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    className="
                        border
                        p-2
                        rounded
                        w-full
                    "
                >
                    <option value="">Select Patient</option>

                    {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                            {patient.name}
                        </option>
                    ))}
                </select>

                <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className="
                        border
                        p-2
                        rounded
                        w-full
                    "
                >
                    <option value="">Select Doctor</option>

                    {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                            {doctor.name}
                        </option>
                    ))}
                </select>

                <input
                    type="datetime-local"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    className="
                        border
                        p-2
                        rounded
                        w-full
                    "
                />

                <button
                    type="submit"
                    className="
                        bg-blue-500
                        text-white
                        px-4
                        py-2
                        rounded
                    "
                >
                    {editingAppointmentId
                        ? "Update Appointment"
                        : "Create Appointment"}
                </button>
            </form>

            <table
                className="
                    w-full
                    bg-white
                    shadow-md
                    rounded
                "
            >
                <thead>
                    <tr>
                        <th className="border p-3">ID</th>

                        <th className="border p-3">Patient</th>

                        <th className="border p-3">Doctor</th>

                        <th className="border p-3">Appointment Date</th>

                        <th className="border p-3">Status</th>

                        <th className="border p-3">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td className="border p-3">{appointment.id}</td>

                            <td className="border p-3">
                                {appointment.patientName}
                            </td>

                            <td className="border p-3">
                                {appointment.doctorName}
                            </td>

                            <td className="border p-3">
                                {appointment.appointmentDate}
                            </td>

                            <td className="border p-3">{appointment.status}</td>

                            <td className="border p-3">
                                <button
                                    onClick={() =>
                                        handleEditAppointment(appointment)
                                    }
                                    className="
                                        bg-yellow-500
                                        text-white
                                        px-3
                                        py-1
                                        rounded
                                        mr-2
                                    "
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        openDeleteModal(appointment.id)
                                    }
                                    className="
                                        bg-red-500
                                        text-white
                                        px-3
                                        py-1
                                        rounded
                                    "
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ConfirmModal
                isOpen={isModalOpen}
                title="Delete Appointment"
                message="
                        Are you sure you want to delete this appointment?"
                onConfirm={() => {
                    handleDeleteAppointment(selectedAppointmentId);

                    setIsModalOpen(false);
                }}
                onCancel={() => setIsModalOpen(false)}
            />
        </DashboardLayout>
    );
}

export default AppointmentsPage;
