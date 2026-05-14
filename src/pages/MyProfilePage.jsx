import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import api from "../api/axiosConfig";

function MyProfilePage() {
    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/patients/me");

            setProfile(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <p>Loading profile...</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div
                className="
                    max-w-2xl
                    mx-auto
                    bg-white
                    p-6
                    rounded-lg
                    shadow
                "
            >
                <h1
                    className="
                        text-2xl
                        font-bold
                        mb-6
                    "
                >
                    My Profile
                </h1>

                <div className="space-y-4">
                    <div>
                        <strong>Name:</strong> {profile.name}
                    </div>

                    <div>
                        <strong>Phone:</strong> +91 {profile.phone}
                    </div>

                    <div>
                        <strong>Age:</strong> {profile.age}
                    </div>

                    <div>
                        <strong>Gender:</strong> {profile.gender}
                    </div>

                    <div>
                        <strong>Disease:</strong> {profile.disease}
                    </div>

                    <div>
                        <strong>Username:</strong> {profile.user?.username}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default MyProfilePage;
