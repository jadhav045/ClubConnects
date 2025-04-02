import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import axios from "axios";
import StudentAlumniProfile from "./StudentAlumniProfile";
import { API_URL, getToken } from "../../../../routes/apiConfig";

const ProfileWrapper = () => {
	const { userId } = useParams();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = getToken();

				const response = await axios.get(`${API_URL}/auth/${userId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				console.log(response.data.user);
				setUser(response.data.user);
			} catch (error) {
				console.error("Error fetching user data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [userId]);

	if (loading) return <p>Loading...</p>;

	return <StudentAlumniProfile user={user} />;
};

export default ProfileWrapper;
