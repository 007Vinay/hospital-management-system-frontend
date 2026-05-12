import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axiosConfig";

function PatientsPage() {

    const [patients, setPatients] =
        useState([]);

    const [loading, setLoading] =
    useState(true);

    const [error, setError] =
    useState("");  

    const fetchPatients = async () => {

        try {

            setLoading(true);

            const response =
             await api.get("/patients");

            setPatients(response.data);

        } catch (error) {

            console.error(error);

            setError(
                "Failed to fetch patients"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchPatients();

    }, []);

    return (

        <DashboardLayout>

            <h2>Patients Page</h2>

            {loading && <p>Loading patients...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && (

                <ul>

                    {patients.map((patient) => (

                        <li key={patient.id}>

                            {patient.name}
                            {" - "}
                            {patient.disease}

                        </li>
                    ))}
                    
                </ul>
            )}

        </DashboardLayout>
    );
}

export default PatientsPage;