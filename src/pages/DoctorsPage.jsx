import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../api/axiosConfig";

import { toast } from "react-toastify";

import ConfirmModal from "../components/ConfirmModal";

function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [formError, setFormError] = useState("");

    const [editingDoctorId, setEditingDoctorId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        email: "",
        qualification: "",
        experienceYears: "",
        specialization: "",
    });

    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const doctorsPerPage = 5;

    const [sortField, setSortField] = useState("");

    const [sortOrder, setSortOrder] = useState("asc");

    const [submitting, setSubmitting] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedDoctorId, setSelectedDoctorId] = useState(null);

    const fetchDoctors = async () => {
        try {
            setLoading(true);

            const response = await api.get("/doctors");

            setDoctors(response.data);
        } catch (error) {
            console.error(error);

            setError("Failed to fetch doctors");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

        if (
            !formData.name ||
            !formData.gender ||
            !formData.email ||
            !formData.qualification ||
            !formData.experienceYears ||
            !formData.specialization
        ) {
            setFormError("All fields are required");

            return;
        }

        setSubmitting(true);

        try {
            if (editingDoctorId) {
                await api.put(`/doctors/${editingDoctorId}`, formData);

                toast.success("Doctor updated successfully");
            } else {
                await api.post("/doctors", formData);

                toast.success("Doctor added successfully");
            }

            await fetchDoctors();

            setFormData({
                name: "",
                gender: "",
                email: "",
                qualification: "",
                experienceYears: "",
                specialization: "",
            });

            setEditingDoctorId(null);

            setFormError("");
        } catch (error) {
            console.error(error);

            toast.error(error.response?.data?.message || "Operation failed");

            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setFormError(error.response.data.message);
            } else {
                setFormError("Operation failed");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditDoctor = (doctor) => {
        setEditingDoctorId(doctor.id);

        setFormData({
            name: doctor.name,
            gender: doctor.gender,
            email: doctor.email,
            qualification: doctor.qualification,
            experienceYears: doctor.experienceYears,
            specialization: doctor.specialization,
        });
    };

    const handleDeleteDoctor = async (id) => {
        try {
            await api.delete(`/doctors/${id}`);

            await fetchDoctors();

            toast.success("Doctor deleted successfully");
        } catch (error) {
            console.error(error);

            toast.error("Delete failed");
        }
    };

    const openDeleteModal = (id) => {
        setSelectedDoctorId(id);

        setIsModalOpen(true);
    };

    const filteredDoctors = doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedDoctors = [...filteredDoctors].sort((a, b) => {
        if (!sortField) return 0;

        if (a[sortField] < b[sortField]) {
            return sortOrder === "asc" ? -1 : 1;
        }

        if (a[sortField] > b[sortField]) {
            return sortOrder === "asc" ? 1 : -1;
        }

        return 0;
    });

    const indexOfLastDoctor = currentPage * doctorsPerPage;

    const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;

    const currentDoctors = sortedDoctors.slice(
        indexOfFirstDoctor,
        indexOfLastDoctor
    );

    const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

    return (
        <DashboardLayout>
            <h2>Add Doctor</h2>

            {formError && <p>{formError}</p>}

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
                <input
                    type="text"
                    name="name"
                    placeholder="Doctor Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="
                        border
                        p-2
                        rounded
                        w-full
                    "
                />

                <input
                    type="text"
                    name="gender"
                    placeholder="Gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="
                        border
                        p-2
                        rounded
                        w-full
                    "
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="
                        border
                        p-2
                        rounded
                        w-full
                    "
                />

                <input
                    type="text"
                    name="qualification"
                    placeholder="Qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="
                        border
                        p-2
                        rounded
                        w-full
                    "
                />

                <input
                    type="number"
                    name="experienceYears"
                    placeholder="Experience Years"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="
                        border
                        p-2
                        rounded
                        w-full
                    "
                />

                <input
                    type="text"
                    name="specialization"
                    placeholder="Specialization"
                    value={formData.specialization}
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
                    disabled={submitting}
                    className="
                        bg-blue-600
                        text-white
                        px-4
                        py-2
                        rounded
                        disabled:bg-gray-400
                    "
                >
                    {submitting
                        ? "Processing..."
                        : editingDoctorId
                          ? "Update Doctor"
                          : "Add Doctor"}
                </button>
            </form>

            <hr />

            <h2
                className="
                    text-3xl
                    font-bold
                    mb-6
                "
            >
                Doctors Page
            </h2>

            <input
                type="text"
                placeholder="Search doctor by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                    border
                    p-2
                    rounded
                    mb-4
                    w-full
                    bg-white
                "
            />

            <div
                className="
                    flex
                    gap-4
                    mb-4
                "
            >
                <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="
                        border
                        p-2
                        rounded
                    "
                >
                    <option value="">Sort By</option>

                    <option value="name">Name</option>

                    <option value="experienceYears">Experience</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="
                        border
                        p-2
                        rounded
                    "
                >
                    <option value="asc">Ascending</option>

                    <option value="desc">Descending</option>
                </select>
            </div>

            {loading && <p>Loading doctors...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && doctors.length === 0 && (
                <p>No doctors found</p>
            )}

            {!loading && !error && (
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

                            <th className="border p-3">Name</th>

                            <th className="border p-3">Gender</th>

                            <th className="border p-3">Email</th>

                            <th className="border p-3">Qualification</th>

                            <th className="border p-3">Experience</th>

                            <th className="border p-3">Specialization</th>

                            <th className="border p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentDoctors.map((doctor) => (
                            <tr key={doctor.id}>
                                <td className="border p-3">{doctor.id}</td>

                                <td className="border p-3">{doctor.name}</td>

                                <td className="border p-3">{doctor.gender}</td>

                                <td className="border p-3">{doctor.email}</td>

                                <td className="border p-3">
                                    {doctor.qualification}
                                </td>

                                <td className="border p-3">
                                    {doctor.experienceYears}
                                </td>

                                <td className="border p-3">
                                    {doctor.specialization}
                                </td>

                                <td className="border p-3">
                                    <button
                                        type="button"
                                        onClick={() => handleEditDoctor(doctor)}
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
                                        type="button"
                                        onClick={() =>
                                            openDeleteModal(doctor.id)
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
            )}

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
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="
                        bg-blue-500
                        text-white
                        px-4
                        py-2
                        rounded
                        disabled:bg-gray-400
                    "
                >
                    Previous
                </button>

                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="
                        bg-blue-500
                        text-white
                        px-4
                        py-2
                        rounded
                        disabled:bg-gray-400
                    "
                >
                    Next
                </button>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                title="Delete Doctor"
                message="Are you sure you want to delete this doctor?"
                onCancel={() => {
                    setIsModalOpen(false);

                    setSelectedDoctorId(null);
                }}
                onConfirm={() => {
                    handleDeleteDoctor(selectedDoctorId);

                    setIsModalOpen(false);

                    setSelectedDoctorId(null);
                }}
            />
        </DashboardLayout>
    );
}

export default DoctorsPage;
