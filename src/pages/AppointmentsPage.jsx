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

    const [page, setPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    const [size] = useState(5);

    const [sortBy, setSortBy] = useState("appointmentDate");

    const [statusFilter, setStatusFilter] = useState("");

    const [doctorFilter, setDoctorFilter] = useState("");

    const [patientFilter, setPatientFilter] = useState("");

    const [doctorSearch, setDoctorSearch] = useState("");

    const [patientSearch, setPatientSearch] = useState("");

    const [showDoctorSuggestions, setShowDoctorSuggestions] = useState(false);

    const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");

    const [formData, setFormData] = useState({
        patientId: "",

        doctorId: "",

        appointmentDate: "",
    });

    // FILTERED DOCTORS

    const filteredDoctors = doctors.filter((doctor) =>
        doctor.name?.toLowerCase().includes(doctorSearch.toLowerCase())
    );

    // FILTERED PATIENTS

    const filteredPatients = patients.filter((patient) =>
        patient.name?.toLowerCase().includes(patientSearch.toLowerCase())
    );

    // FETCH APPOINTMENTS

    const fetchAppointments = async () => {
        try {
            let url = "";

            // DATE RANGE FILTER

            if (startDate && endDate) {
                url = `/appointments/date-range?startDate=${startDate}&endDate=${endDate}`;

                const response = await api.get(url);

                setAppointments(response.data);

                setTotalPages(1);

                return;
            }

            // SEARCH + FILTER + PAGINATION

            url = `/appointments/search?page=${page}&size=${size}&sortBy=${sortBy}`;

            if (statusFilter !== "") {
                url += `&status=${statusFilter}`;
            }

            if (doctorFilter !== "") {
                url += `&doctorId=${doctorFilter}`;
            }

            if (patientFilter !== "") {
                url += `&patientId=${patientFilter}`;
            }

            const response = await api.get(url);

            setAppointments(response.data.content || []);

            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error(error);

            toast.error("Failed to fetch appointments");
        }
    };

    // FETCH PATIENTS

    const fetchPatients = async () => {
        try {
            const response = await api.get("/patients");

            setPatients(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // FETCH DOCTORS

    const fetchDoctors = async () => {
        try {
            const response = await api.get("/doctors");

            setDoctors(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // INITIAL LOAD

    useEffect(() => {
        fetchPatients();

        fetchDoctors();
    }, []);

    // REFETCH ON FILTER CHANGE

    useEffect(() => {
        fetchAppointments();
    }, [
        page,
        sortBy,
        statusFilter,
        doctorFilter,
        patientFilter,
        startDate,
        endDate,
    ]);

    // HANDLE FORM CHANGE

    const handleChange = (e) => {
        setFormData({
            ...formData,

            [e.target.name]: e.target.value,
        });
    };

    // CREATE / UPDATE APPOINTMENT

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
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

            toast.error("Appointment failed");
        }
    };

    // OPEN DELETE MODAL

    const openDeleteModal = (id) => {
        setSelectedAppointmentId(id);

        setIsModalOpen(true);
    };

    // DELETE APPOINTMENT

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

    // EDIT APPOINTMENT

    const handleEditAppointment = (appointment) => {
        setFormData({
            patientId: appointment.patientId || "",

            doctorId: appointment.doctorId || "",

            appointmentDate: appointment.appointmentDate
                ?.replace(" ", "T")
                ?.slice(0, 16),
        });

        setEditingAppointmentId(appointment.id);
    };

    // CLEAR FILTERS

    const handleClearFilters = () => {
        setStatusFilter("");

        setDoctorFilter("");

        setPatientFilter("");

        setDoctorSearch("");

        setPatientSearch("");

        setStartDate("");

        setEndDate("");

        setSortBy("appointmentDate");

        setPage(0);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.patch(`/appointments/${id}/status?status=${status}`);

            toast.success(`Appointment ${status.toLowerCase()} successfully`);

            fetchAppointments();
        } catch (error) {
            console.error(error);

            toast.error("Failed to update status");
        }
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
            {/* APPOINTMENT FORM */}
            <form
                onSubmit={handleSubmit}
                className="
                    bg-white
                    p-6
                    rounded-xl
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
                        p-3
                        rounded-lg
                        w-full
                    "
                >
                    <option value="">Select Patient</option>

                    {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className="
                        border
                        p-3
                        rounded-lg
                        w-full
                    "
                >
                    <option value="">Select Doctor</option>

                    {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                            {d.name}
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
                        p-3
                        rounded-lg
                        w-full
                    "
                />

                <button
                    type="submit"
                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        px-5
                        py-2
                        rounded-lg
                    "
                >
                    {editingAppointmentId
                        ? "Update Appointment"
                        : "Create Appointment"}
                </button>
            </form>
            {/* FILTERS */}
            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-4
                    mb-6
                "
            >
                {/* STATUS FILTER */}

                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setPage(0);

                        setStatusFilter(e.target.value);
                    }}
                    className="
                        border
                        p-3
                        rounded-lg
                        bg-white
                    "
                >
                    <option value="">All Status</option>

                    <option value="SCHEDULED">Scheduled</option>

                    <option value="PENDING">Pending</option>

                    <option value="COMPLETED">Completed</option>
                </select>

                {/* DOCTOR SEARCH */}

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search Doctor"
                        value={doctorSearch}
                        onChange={(e) => {
                            const value = e.target.value;

                            setDoctorSearch(value);

                            setShowDoctorSuggestions(true);

                            setPage(0);

                            if (value === "") {
                                setDoctorFilter("");
                            }
                        }}
                        className="
                            border
                            p-3
                            rounded-lg
                            w-full
                            bg-white
                        "
                    />

                    {showDoctorSuggestions && doctorSearch && (
                        <div
                            className="
                                absolute
                                z-10
                                bg-white
                                border
                                rounded-lg
                                w-full
                                max-h-48
                                overflow-y-auto
                                shadow-lg
                            "
                        >
                            {filteredDoctors.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    onClick={() => {
                                        setDoctorFilter(doctor.id);

                                        setDoctorSearch(doctor.name);

                                        setShowDoctorSuggestions(false);

                                        setPage(0);
                                    }}
                                    className="
                                            p-3
                                            hover:bg-gray-100
                                            cursor-pointer
                                        "
                                >
                                    {doctor.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PATIENT SEARCH */}

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search Patient"
                        value={patientSearch}
                        onChange={(e) => {
                            const value = e.target.value;

                            setPatientSearch(value);

                            setShowPatientSuggestions(true);

                            setPage(0);

                            if (value === "") {
                                setPatientFilter("");
                            }
                        }}
                        className="
                            border
                            p-3
                            rounded-lg
                            w-full
                            bg-white
                        "
                    />

                    {showPatientSuggestions && patientSearch && (
                        <div
                            className="
                                absolute
                                z-10
                                bg-white
                                border
                                rounded-lg
                                w-full
                                max-h-48
                                overflow-y-auto
                                shadow-lg
                            "
                        >
                            {filteredPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    onClick={() => {
                                        setPatientFilter(patient.id);

                                        setPatientSearch(patient.name);

                                        setShowPatientSuggestions(false);

                                        setPage(0);
                                    }}
                                    className="
                                            p-3
                                            hover:bg-gray-100
                                            cursor-pointer
                                        "
                                >
                                    {patient.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* START DATE */}
                <div>
                    <label
                        className="
                            block
                            mb-1
                            font-medium
                        "
                    >
                        Start Date
                    </label>

                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);

                            setPage(0);
                        }}
                        className="
                            border
                            p-3
                            rounded-lg
                            bg-white
                            w-full
                        "
                    />
                </div>
                {/* END DATE */}
                <div>
                    <label
                        className="
                            block
                            mb-1
                            font-medium
                        "
                    >
                        End Date
                    </label>

                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);

                            setPage(0);
                        }}
                        className="
                            border
                            p-3
                            rounded-lg
                            bg-white
                            w-full
                        "
                    />
                </div>
                {/* SORT */}
                <div>
                    <label
                        className="
                            block
                            mb-1
                            font-medium
                        "
                    >
                        Sort
                    </label>

                    <select
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value);

                            setPage(0);
                        }}
                        className="
                            border
                            p-3
                            rounded-lg
                            bg-white
                            w-full
                        "
                    >
                        <option value="appointmentDate">Sort By Date</option>

                        <option value="status">Sort By Status</option>
                    </select>
                </div>
            </div>
            {/* CLEAR FILTER */}
            <div className="mb-6">
                <button
                    onClick={handleClearFilters}
                    className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-5
                        py-2
                        rounded-lg
                    "
                >
                    Clear Filters
                </button>
            </div>
            {/* APPOINTMENTS TABLE */}
            <div
                className="
                    overflow-x-auto
                    bg-white
                    rounded-xl
                    shadow-md
                "
            >
                <table
                    className="
                        w-full
                        border-collapse
                    "
                >
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 border">ID</th>

                            <th className="p-4 border">Patient</th>

                            <th className="p-4 border">Age</th>

                            <th className="p-4 border">Gender</th>

                            <th className="p-4 border">Disease</th>

                            <th className="p-4 border">Phone</th>

                            <th className="p-4 border">Doctor</th>

                            <th className="p-4 border">Appointment Date</th>

                            <th className="p-4 border">Status</th>

                            <th className="p-4 border">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {appointments.length > 0 ? (
                            appointments.map((a) => (
                                <tr
                                    key={a.id}
                                    className="
                                        hover:bg-gray-50
                                    "
                                >
                                    <td className="p-4 border">{a.id}</td>

                                    <td className="p-4 border">
                                        {a.patientName}
                                    </td>

                                    <td className="p-4 border">
                                        {a.patientAge}
                                    </td>

                                    <td className="p-4 border">
                                        {a.patientGender}
                                    </td>

                                    <td className="p-4 border">
                                        {a.patientDisease}
                                    </td>

                                    <td className="p-4 border">
                                        {a.patientPhone}
                                    </td>

                                    <td className="p-4 border">
                                        {a.doctorName}
                                    </td>

                                    <td className="p-4 border">
                                        {a.appointmentDate}
                                    </td>

                                    <td className="p-4 border">{a.status}</td>

                                    <td className="p-4 border min-w-[320px]">
                                        <div className="flex gap-2 whitespace-nowrap">
                                            {/* EDIT */}

                                            <button
                                                onClick={() =>
                                                    handleEditAppointment(a)
                                                }
                                                className="
                                                    bg-yellow-500
                                                    hover:bg-yellow-600
                                                    text-white
                                                    px-3
                                                    py-1
                                                    rounded-lg
                                                    mr-2
                                                    mb-2
                                                "
                                            >
                                                Edit
                                            </button>

                                            {/* DELETE */}

                                            <button
                                                onClick={() =>
                                                    openDeleteModal(a.id)
                                                }
                                                className="
                                                    bg-red-500
                                                    hover:bg-red-600
                                                    text-white
                                                    px-3
                                                    py-1
                                                    rounded-lg
                                                    mr-2
                                                    mb-2
                                                "
                                            >
                                                Delete
                                            </button>

                                            {/* PENDING ACTIONS */}

                                            {a.status === "PENDING" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                a.id,
                                                                "SCHEDULED"
                                                            )
                                                        }
                                                        className="
                                                            bg-green-600
                                                            hover:bg-green-700
                                                            text-white
                                                            px-3
                                                            py-1
                                                            rounded-lg
                                                            mr-2
                                                            mb-2
                                                        "
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                a.id,
                                                                "REJECTED"
                                                            )
                                                        }
                                                        className="
                                                            bg-gray-600
                                                            hover:bg-gray-700
                                                            text-white
                                                            px-3
                                                            py-1
                                                            rounded-lg
                                                            mb-2
                                                        "
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {/* SCHEDULED ACTIONS */}

                                            {a.status === "SCHEDULED" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                a.id,
                                                                "COMPLETED"
                                                            )
                                                        }
                                                        className="
                                                            bg-blue-600
                                                            hover:bg-blue-700
                                                            text-white
                                                            px-3
                                                            py-1
                                                            rounded-lg
                                                            mr-2
                                                            mb-2
                                                        "
                                                    >
                                                        Complete
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                a.id,
                                                                "CANCELLED"
                                                            )
                                                        }
                                                        className="
                                                            bg-orange-500
                                                            hover:bg-orange-600
                                                            text-white
                                                            px-3
                                                            py-1
                                                            rounded-lg
                                                            mb-2
                                                        "
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="10"
                                    className="
                                        text-center
                                        p-6
                                    "
                                >
                                    No appointments found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* PAGINATION */}
            <div
                className="
                    flex
                    justify-center
                    items-center
                    gap-4
                    mt-6
                "
            >
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        disabled:bg-gray-400
                        text-white
                        px-5
                        py-2
                        rounded-lg
                    "
                >
                    Previous
                </button>

                <span className="font-semibold">
                    Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
                </span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page + 1 >= totalPages}
                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        disabled:bg-gray-400
                        text-white
                        px-5
                        py-2
                        rounded-lg
                    "
                >
                    Next
                </button>
            </div>
            {/* DELETE CONFIRMATION MODAL */}
            <ConfirmModal
                isOpen={isModalOpen}
                title="Delete Appointment"
                message="
                    Are you sure you want
                    to delete this appointment?
                "
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
