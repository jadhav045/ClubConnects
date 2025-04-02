import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	List,
	ListItem,
	ListItemText,
	Button,
	Box,
	Typography,
	Chip,
	CircularProgress,
} from "@mui/material";
import axios from "axios";
import { API_URL } from "../../../routes/apiConfig";

const RoundParticipants = ({ opportunity }) => {
	const [selectedRound, setSelectedRound] = useState(null);
	const [participants, setParticipants] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleRoundClick = async (roundNumber) => {
		try {
			setLoading(true);

			console.log("fonr");
			setError(null);
			const response = await axios.get(
				`${API_URL}/opportunities/${opportunity._id}/round/${roundNumber}/students`
			);
			setParticipants(response.data.data.studentIds);
			setSelectedRound(roundNumber);
		} catch (error) {
			setError("Failed to fetch participants");
			console.error("Error fetching participants:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box>
			<Typography
				variant="h6"
				gutterBottom
			>
				Previous Rounds Participants
			</Typography>

			<Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
				{opportunity.rounds.map(
					(round, index) =>
						index <= opportunity.currentRound && (
							<Chip
								key={index}
								label={`Round ${index + 1}: ${round.type}`}
								onClick={() => handleRoundClick(index)}
								color={selectedRound === index ? "primary" : "default"}
								variant={selectedRound === index ? "filled" : "outlined"}
							/>
						)
				)}
			</Box>

			{loading && <CircularProgress />}

			{error && <Typography color="error">{error}</Typography>}

			{selectedRound !== null && !loading && !error && (
				<Box>
					<Typography
						variant="subtitle1"
						gutterBottom
					>
						Participants for Round {selectedRound + 1}
					</Typography>
					<List>
						{participants.map((participant, index) => (
							<ListItem key={index}>
								<ListItemText primary={participant} />
							</ListItem>
						))}
					</List>
				</Box>
			)}
		</Box>
	);
};

export default RoundParticipants;
