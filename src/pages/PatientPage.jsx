import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axiosConfig";

function PatientsPage() {

    const [patients, setPatients] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [formError, setFormError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        disease: "",
        phone: ""
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
            [e.target.name]: e.target.value
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

            await api.post("/patients", formData);

            fetchPatients();

            setFormData({
                name: "",
                age: "",
                gender: "",
                disease: "",
                phone: ""
            });

        } catch (error) {

            console.error(error);

            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {

                setFormError(
                    error.response.data.message
                );

            } else {
                setFormError("Failed to add patient");
            }
        }
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
                    Add Patient
                </button>

            </form>

            <hr />

            <h2>Patients Page</h2>

            {loading && <p>Loading patients...</p>}

            {error && <p>{error}</p>}

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

                            </tr>
                        ))}

                    </tbody>

                </table>
            )}

        </DashboardLayout>
    );
}

export default PatientsPage;