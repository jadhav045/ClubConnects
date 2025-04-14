import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL, getToken } from "../../../../routes/apiConfig";
import { CircularProgress } from "@mui/material";
import ClubProfileCard from "./ClubProfileCard";
import EditClubProfile from "./EditClubProfile";
import { useClubCard } from "../../club/ClubCardLogic";

const ClubProfile = () => {
	const { id } = useParams();
	const [club, setClub] = useState(null);
	const [open, setOpen] = useState(false); // for edit modal if needed


	console.log("Club-Id", id);

	useEffect(() => {
		const fetchClub = async () => {
			try {
				const token = getToken(); // Get token from localStorage
				const response = await axios.get(`${API_URL}/student/club/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setClub(response.data.club);
			} catch (error) {
				console.error("Error fetching club data:", error);
			}
		};

		fetchClub();
	}, [id]);

	if (!club) {
		return (
			<div className="flex justify-center items-center h-screen">
				<CircularProgress />
			</div>
		);
	}

	const handleUpdateClub = async (updatedData) => {
		try {
			const token = getToken();
			const response = await axios.put(
				`${API_URL}/student/club/${id}`,
				updatedData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setClub(response.data.club);
			setOpen(false); // Close the form
		} catch (error) {
			console.error("Update failed:", error);
		}
	};
	return (
		<>
			{open ? (
				<EditClubProfile
					clubData={club}
					onSave={handleUpdateClub}
					onCancel={() => setOpen(false)} // ✅ Pass the cancel handler
				/>
			) : (
				<ClubProfileCard
					data={club}
					onEditClick={() => setOpen(true)}
				/>
			)}
		</>
	);
};

export default ClubProfile;
