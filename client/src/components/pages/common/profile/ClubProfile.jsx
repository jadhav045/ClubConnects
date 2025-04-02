import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	API_URL,
	getPresidentClub,
	getToken,
} from "../../../../routes/apiConfig";
import { Awards, Skills, SocialLinks } from "./SubComponent";

import {
	ClubMembers,
	ClubResponsiveNavigation,
} from "./ClubResponsiveNavigation";
import {
	Card,
	CardContent,
	Typography,
	Box,
	CircularProgress,
	Button,
} from "@mui/material";
import { UpdateClubProfile } from "./ClubUpdateProfile";

const ClubProfile = () => {
	const { id } = useParams(); // Get clubId from URL
	const [club, setClub] = useState(null);
	const [open, setOpen] = useState(false);

	console.log("ClubId", id);
	useEffect(() => {
		const fetchClub = async () => {
			try {
				const token = getToken(); // Get token from localStorage
				const response = await axios.get(`${API_URL}/student/club/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`, // Send token in headers
					},
				});
				setClub(response.data.club);
			} catch (error) {
				console.error("Error fetching club data:", error);
			}
		};

		fetchClub();
	}, [id]);

	if (!club)
		return (
			<Box className="flex justify-center items-center h-screen">
				<CircularProgress />
			</Box>
		);

	return (
		<Box className="p-6 max-w-4xl mx-auto">
			{/* <div className="p-6 flex flex-col items-center">
				<Button
					onClick={() => setOpen(true)}
					className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
				>
					Edit Club Profile
				</Button>
				<UpdateClubProfile
					club={club}
					open={open}
					setOpen={setOpen}
				/>
			</div> */}

			<Card className="mb-6 shadow-lg p-4 flex">
				<CardContent>
					<img
						src={club.logo}
						alt="Club Logo"
						className="w-32 h-32 mx-auto rounded-full"
					/>
					<Typography
						variant="body2"
						className="mt-2"
					>
						Founding Year: {club.foundingYear}
					</Typography>
				</CardContent>
				<CardContent className="text-center">
					<Typography
						variant="h5"
						className="mt-4 font-bold"
					>
						{club.clubName} ({club.shortName})
					</Typography>
					<Typography
						variant="body1"
						color="textSecondary"
					>
						{club.motto}
					</Typography>
					<Typography
						variant="body2"
						className="mt-2"
					>
						{club.description}
					</Typography>
				</CardContent>
			</Card>

			<Box className="bg-gray-50 p-4 rounded-md shadow-md mb-6">
				<Skills skills={club?.skills} />
			</Box>

			<ClubMembers
				members={club.members}
				followers={club.followers}
			/>
			<SocialLinks socialLinks={club?.socialLinks} />
			<Awards awards={club.achievements} />
			<ClubResponsiveNavigation club={club} />
		</Box>
	);
};

export default ClubProfile;
