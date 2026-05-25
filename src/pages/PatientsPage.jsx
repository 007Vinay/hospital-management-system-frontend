import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

function PatientsPage() {
    const [patients, setPatients] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [formError, setFormError] = useState("");

    const [editingPatientId, setEditingPatientId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        phone: "",
        email: "",
        disease: "",
        username: "",
        password: "",
    });

    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const patientsPerPage = 5;

    const [sortField, setSortField] = useState("");

    const [sortOrder, setSortOrder] = useState("asc");

    const [submitting, setSubmitting] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedPatientId, setSelectedPatientId] = useState(null);

    const fetchPatients = async () => {
        try {
            setLoading(true);

            const response = await api.get("/patients");

            setPatients(response.data);
        } catch (error) {
            console.error(error);

            setError("Failed to fetch patients");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.phone ||
            !formData.email ||
            !formData.age ||
            !formData.gender ||
            !formData.disease ||
            !formData.username ||
            !formData.password
        ) {
            setFormError("All fields are required");

            return;
        }

        setSubmitting(true);

        try {
            if (editingPatientId) {
                await api.put(`/patients/${editingPatientId}`, formData);
            } else {
                await api.post("/patients", formData);
            }

            fetchPatients();

            toast.success(
                editingPatientId
                    ? "Patient updated successfully"
                    : "Patient added successfully"
            );

            setEditingPatientId(null);

            setFormData({
                name: "",
                phone: "",
                email: "",
                age: "",
                gender: "",
                disease: "",
                username: "",
                password: "",
            });

            setFormError("");
        } catch (error) {
            console.error(error);

            const errorMessage =
                error.response?.data?.messages?.phone ||
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to add patient";

            setFormError(errorMessage);

            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePatient = async (id) => {
        try {
            await api.delete(`/patients/${id}`);

            fetchPatients();
            toast.success("Patient deleted successfully");
        } catch (error) {
            console.error(error);

            toast.error("Operation failed");
        }
    };

    const openDeleteModal = (id) => {
        setSelectedPatientId(id);

        setIsModalOpen(true);
    };

    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedPatients = [...filteredPatients].sort((a, b) => {
        if (!sortField) return 0;

        if (a[sortField] < b[sortField]) {
            return sortOrder === "asc" ? -1 : 1;
        }

        if (a[sortField] > b[sortField]) {
            return sortOrder === "asc" ? 1 : -1;
        }

        return 0;
    });

    const indexOfLastPatient = currentPage * patientsPerPage;

    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;

    const currentPatients = sortedPatients.slice(
        indexOfFirstPatient,
        indexOfLastPatient
    );

    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

    const handleEditPatient = (patient) => {
        setEditingPatientId(patient.id);

        setFormData({
            name: patient.name,
            phone: patient.phone,
            email: patient.email,
            age: patient.age,
            gender: patient.gender,
            disease: patient.disease,
            username: patient.username || "",
            password: "",
        });
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <DashboardLayout>
            <h2>Add Patient</h2>

            {formError && <p>{formError}</p>}

            <form
                onSubmit={handleAddPatient}
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
                    placeholder="Name"
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
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
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
                    type="text"
                    name="disease"
                    placeholder="Disease"
                    value={formData.disease}
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
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
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
                    name="username"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="
                            border
                            p-3
                            rounded-lg
                            w-full
                        "
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
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
                        : editingPatientId
                          ? "Update Patient"
                          : "Add Patient"}
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
                Patients Page
            </h2>

            <input
                type="text"
                placeholder="Search patient by name"
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

                    <option value="age">Age</option>
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

            {loading && <p>Loading patients...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && patients.length === 0 && (
                <p>No patients found</p>
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
                            <th className="border p-3">Age</th>
                            <th className="border p-3">Gender</th>
                            <th className="border p-3">Disease</th>
                            <th className="border p-3">Phone</th>
                            <th className="border p-3">Email</th>
                            <th className="border p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentPatients.map((patient) => (
                            <tr key={patient.id}>
                                <td className="border p-3">{patient.id}</td>
                                <td className="border p-3">{patient.name}</td>
                                <td className="border p-3">{patient.age}</td>
                                <td className="border p-3">{patient.gender}</td>
                                <td className="border p-3">
                                    {patient.disease}
                                </td>
                                <td className="border p-3">{patient.phone}</td>
                                <td className="border p-3">{patient.email}</td>

                                <td>
                                    <button
                                        onClick={() =>
                                            handleEditPatient(patient)
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
                                        type="button"
                                        onClick={() =>
                                            openDeleteModal(patient.id)
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
                title="Delete Patient"
                message="Are you sure you want to delete this patient?"
                onCancel={() => {
                    setIsModalOpen(false);

                    setSelectedPatientId(null);
                }}
                onConfirm={() => {
                    handleDeletePatient(selectedPatientId);

                    setIsModalOpen(false);

                    setSelectedPatientId(null);
                }}
            />
        </DashboardLayout>
    );
}

export default PatientsPage;
