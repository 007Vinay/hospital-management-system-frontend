import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axiosConfig";

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
        disease: "",
        phone: "",
    });

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
            !formData.age ||
            !formData.gender ||
            !formData.disease ||
            !formData.phone
        ) {
            setFormError("All fields are required");

            return;
        }

        try {
            if (editingPatientId) {
                await api.put(
                    `/patients/${editingPatientId}`,

                    formData
                );
            } else {
                await api.post("/patients", formData);
            }

            fetchPatients();

            setEditingPatientId(null);

            setFormData({
                name: "",
                age: "",
                gender: "",
                disease: "",
                phone: "",
            });
        } catch (error) {
            console.error(error);

            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setFormError(error.response.data.message);
            } else {
                setFormError("Failed to add patient");
            }
        }
    };

    const handleDeletePatient = async (id) => {
        try {
            await api.delete(`/patients/${id}`);

            fetchPatients();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditPatient = (patient) => {
        setEditingPatientId(patient.id);

        setFormData({
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            disease: patient.disease,
            phone: patient.phone,
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
                    {editingPatientId ? "Update Patient" : "Add Patient"}
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
                            <th className="border p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id}>
                                <td className="border p-3">{patient.id}</td>
                                <td className="border p-3">{patient.name}</td>
                                <td className="border p-3">{patient.age}</td>
                                <td className="border p-3">{patient.gender}</td>
                                <td className="border p-3">
                                    {patient.disease}
                                </td>
                                <td className="border p-3">{patient.phone}</td>

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
                                        onClick={() =>
                                            handleDeletePatient(patient.id)
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
        </DashboardLayout>
    );
}

export default PatientsPage;
