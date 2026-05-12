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

            <form onSubmit={handleAddPatient}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="gender"
                    placeholder="Gender"
                    value={formData.gender}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="disease"
                    placeholder="Disease"
                    value={formData.disease}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <button type="submit">
                    {editingPatientId ? "Update Patient" : "Add Patient"}
                </button>
            </form>

            <hr />

            <h2>Patients Page</h2>

            {loading && <p>Loading patients...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && patients.length === 0 && (
                <p>No patients found</p>
            )}

            {!loading && !error && (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Disease</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id}>
                                <td>{patient.id}</td>
                                <td>{patient.name}</td>
                                <td>{patient.age}</td>
                                <td>{patient.gender}</td>
                                <td>{patient.disease}</td>
                                <td>{patient.phone}</td>

                                <td>
                                    <button
                                        onClick={() =>
                                            handleEditPatient(patient)
                                        }
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDeletePatient(patient.id)
                                        }
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
