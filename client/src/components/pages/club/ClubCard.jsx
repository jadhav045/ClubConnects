import React from "react";
import { useNavigate } from "react-router-dom";
import {
	Card,
	CardContent,
	CardHeader,
	Typography,
	Chip,
	Button,
} from "@mui/material";
import { CheckCircle, Group, Description, Event } from "@mui/icons-material";
import { useSelector } from "react-redux";
import store from "../../../store/store";

const ClubCard = ({ club }) => {
	const { user } = useSelector((store) => store.auth);
	const navigate = useNavigate();

	const handleViewProfile = () => {
		navigate(`${club._id}`, { state: { club } });
	};

	return (
		<Card sx={{ maxWidth: 345, p: 2, borderRadius: 2, boxShadow: 3 }}>
			<CardHeader
				title={
					<Typography
						variant="h6"
						fontWeight="bold"
					>
						{club.clubName}
					</Typography>
				}
				subheader={
					<Typography
						variant="body2"
						color="textSecondary"
					>
						{club.shortName}
					</Typography>
				}
			/>
			<CardContent>
				<Typography
					variant="body2"
					color="textSecondary"
					paragraph
				>
					{club.description}
				</Typography>
				<Typography
					variant="body2"
					display="flex"
					alignItems="center"
					gap={1}
				>
					<CheckCircle
						color="success"
						fontSize="small"
					/>{" "}
					Status: {club.status}
				</Typography>
				<Typography
					variant="body2"
					display="flex"
					alignItems="center"
					gap={1}
					mt={1}
				>
					<Group fontSize="small" /> Members: {club.members.length} /{" "}
					{club.maxMembers}
				</Typography>
				<Typography
					variant="body2"
					display="flex"
					alignItems="center"
					gap={1}
					mt={1}
				>
					<Description fontSize="small" /> Documents: {club.documents.length}
				</Typography>
				<Typography
					variant="body2"
					display="flex"
					alignItems="center"
					gap={1}
					mt={1}
				>
					<Event fontSize="small" /> Events: {club.events.length}
				</Typography>
				<Chip
					label={`Motto: ${club.motto}`}
					variant="outlined"
					sx={{ mt: 2 }}
				/>
				<Button
					variant="contained"
					color="primary"
					sx={{ mt: 2, width: "100%" }}
					onClick={handleViewProfile}
				>
					View Profile
				</Button>
			</CardContent>
		</Card>
	);
};

export default ClubCard;
