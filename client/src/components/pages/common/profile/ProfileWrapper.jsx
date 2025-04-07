import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StudentAlumniProfile from "./StudentAlumniProfile";
import UpdateProfile from "./UpdateProfile";
import { API_URL, getToken } from "../../../../routes/apiConfig";
import { CircularProgress } from "@mui/material";

const ProfileWrapper = () => {
	const { userId } = useParams();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = getToken();
				const response = await axios.get(`${API_URL}/auth/${userId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setUser(response.data.user);
			} catch (error) {
				console.error("Error fetching user data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [userId]);

	const handleEditClick = () => setIsEditing(true);
	const handleCloseEdit = () => setIsEditing(false);

	// Optional: handle profile update
	const handleProfileUpdate = (updatedUser) => {
		setUser(updatedUser); // Update local state with new data
		setIsEditing(false); // Close form after saving
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<CircularProgress />
			</div>
		);
	}

	return (
		<>
			{isEditing ? (
				<UpdateProfile
					user={user}
					closeModal={handleCloseEdit}
					onSave={handleProfileUpdate}
				/>
			) : (
				<StudentAlumniProfile
					user={user}
					onEditClick={handleEditClick}
				/>
			)}
		</>
	);
};

export default ProfileWrapper;
