import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	Typography,
	Chip,
	IconButton,
	Menu,
	MenuItem,
	Box,
	Avatar,
	ListItemIcon,
	Dialog,
	DialogTitle,
	DialogContent,
	CardActions,
	Button,
	DialogContentText,
	Tabs,
	Tab,
} from "@mui/material";
import { toast } from "react-toastify";
import {
	MoreVert as MoreVertIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Assignment as AssignmentIcon,
	People as PeopleIcon,
	ListAlt as ListAltIcon,
	Share as ShareIcon,
	Info as InfoIcon,
	AssignmentTurnedIn as AssignmentTurnedInIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import FormCreator from "../../form/FormCreator";
import DynamicRegistrationForm from "../../form/DynamicRegistrationForm";
import ResponseDialog from "../../form/ResponseDialog";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { API_URL, getToken } from "../../../routes/apiConfig";
import { removeOpportunity } from "../../../store/slice/opportunitySlice";
import RoundParticipants from "./RoundParticipants";

const Overview = ({ description }) => (
	<DialogContentText>{description}</DialogContentText>
);

const Rounds = ({ rounds, currentRound, opportunity }) => (
	<Box>
		{rounds.map((round, index) => (
			<Box
				key={index}
				sx={{ mb: 2 }}
			>
				<Typography
					variant="h6"
					gutterBottom
				>
					Round {index + 1}: {round.type}
					{round.testType && ` - ${round.testType}`}
				</Typography>
				<Typography color="text.secondary">
					Status:{" "}
					{index === currentRound
						? "Current"
						: index < currentRound
						? "Completed"
						: "Upcoming"}
				</Typography>
			</Box>
		))}

		{/* Add RoundParticipants if there are completed rounds */}
		{currentRound > 0 && (
			<Box sx={{ mt: 4 }}>
				<RoundParticipants opportunity={opportunity} />
			</Box>
		)}
	</Box>
);

const Requirements = ({ requirements }) => (
	<Box>
		<Typography
			variant="h6"
			gutterBottom
		>
			Requirements:
		</Typography>
		<ul>
			{requirements?.map((req, index) => (
				<li key={index}>
					<Typography>{req}</Typography>
				</li>
			))}
		</ul>
	</Box>
);
const OpportunityCard = ({ opportunity }) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const [isFormRegisterOpen, setIsFormRegisterOpen] = useState(false);
	const [responseDialogOpen, setResponseDialogOpen] = useState(false);
	const [responseType, setResponseType] = useState("REGISTRATION");
	const [responses, setResponses] = useState([]);
	const [loadingResponses, setLoadingResponses] = useState(false);
	const [responsesError, setResponsesError] = useState("");
	const [formType, setFormType] = useState("");
	const [isRegisterDialogOpen, setRegisterDialogOpen] = useState(false);
	const { user } = useSelector((state) => state.auth);

	const [detailsOpen, setDetailsOpen] = useState(false);
	const [currentTab, setCurrentTab] = useState(0);
	const [isRegistered, setIsRegistered] = useState(false);

	const handleOpenDetails = () => setDetailsOpen(true);
	const handleCloseDetails = () => setDetailsOpen(false);
	const handleTabChange = (event, newValue) => setCurrentTab(newValue);

	const dispatch = useDispatch();

	const isOpportunityOpen = () => {
		return (
			opportunity.status === "OPEN" &&
			new Date() < new Date(opportunity.deadline)
		);
	};

	const isOrganizer = user?._id === opportunity?.alumni;

	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleViewResponses = async (type) => {
		try {
			handleClose();
			setLoadingResponses(true);
			setResponsesError("");
			setResponseType(type);

			const response = await axios.get(
				`http://localhost:3002/form/Opportunity/${opportunity._id}/${type}`
			);
			setResponses(response.data);
			setResponseDialogOpen(true);
		} catch (err) {
			setResponsesError("Failed to load responses. Please try again.");
			console.error(err);
		} finally {
			setLoadingResponses(false);
		}
	};

	const handleCreateForm = (formType) => {
		setFormType(formType);
		handleClose();
		setIsFormRegisterOpen(true);
	};

	const handleShare = () => {
		// Implement share functionality
		handleClose();
	};

	const isStudentPresent = opportunity?.participants.includes(
		user._id.toString()
	);

	const getStatusColor = (type) => {
		const colors = {
			INTERNSHIP: "primary",
			JOB: "success",
			RESEARCH: "warning",
			INDUSTRY_PROJECT: "info",
			OTHER: "default",
		};
		return colors[type] || "default";
	};

	const handleRegister = async (formData) => {
		try {
			await axios.post(
				`http://localhost:3002/opportunities/${opportunity._id}/register`,
				{
					...formData,
					userId: user._id,
				}
			);
			setRegisterDialogOpen(false);
			setIsRegistered(true);
			// Optional: Show success message
		} catch (error) {
			console.error("Registration failed:", error);
			// Optional: Show error message
		}
	};

	const handleApplyClick = () => {
		// const studentsId =
		// 	opportunity?.rounds?.[opportunity.currentRound]?.studentsId || [];
		// const isStudentPresent = studentsId.includes(user._id.toString());
		console.log(opportunity);
		console.log(user._id);
		console.log(isStudentPresent);
		if (!user) {
			// Handle not logged in state
			return;
		}
		setRegisterDialogOpen(true);
	};

	// Update the handleFilteredUsers function
	const handleFilteredUsers = async (userIds) => {
		const [moveToNextRoundButton, setMoveToNextRoundButton] = useState(null);
		const [selectedUsers, setSelectedUsers] = useState([]);

		// Store selected users for moving to next round
		setSelectedUsers(userIds);

		// Show the "Move to Next Round" button in ResponseDialog
		if (userIds.length > 0) {
			setMoveToNextRoundButton(
				<Button
					variant="contained"
					color="primary"
					onClick={() => handleMoveToNextRound(userIds)}
					sx={{ mt: 2 }}
				>
					Move {userIds.length} Selected Users to Next Round
				</Button>
			);
		} else {
			setMoveToNextRoundButton(null);
		}
	};

	// Add the handler for moving users to next round
	const handleMoveToNextRound = async (userIds) => {
		try {
			console.log(userIds);
			const token = getToken();
			const response = await axios.post(
				`${API_URL}/opportunities/${opportunity._id}/advance-round`,
				{
					userIds,
					currentRound: opportunity.currentRound,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.success) {
				// Show success message
				toast.success(
					`Successfully moved ${userIds.length} users to the next round`
				);

				// Refresh the responses
				handleViewResponses(responseType);

				// Close the response dialog
				setResponseDialogOpen(false);
			}
		} catch (error) {
			console.error("Failed to move users to next round:", error);
			toast.error("Failed to move users to next round");
		}
	};

	const handleDelete = async () => {
		try {
			handleClose(); // Close the menu
			console.log("handle delete");

			const token = getToken(); // Get token safely

			const response = await axios.delete(
				`${API_URL}/opportunities/${opportunity._id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.success) {
				// Remove from Redux store
				dispatch(removeOpportunity(opportunity._id));
			}
		} catch (error) {
			console.error("Failed to delete opportunity:", error);
			// Add a toast notification if needed
		}
	};

	return (
		<>
			<Card
				sx={{
					mb: 2,
					transition: "transform 0.2s, box-shadow 0.2s",
					"&:hover": {
						transform: "translateY(-4px)",
						boxShadow: 4,
					},
				}}
			>
				<CardHeader
					avatar={
						<Avatar sx={{ bgcolor: "primary.main" }}>
							{opportunity.title.charAt(0)}
						</Avatar>
					}
					action={
						<IconButton onClick={handleClick}>
							<MoreVertIcon />
						</IconButton>
					}
					title={
						<Typography
							variant="h6"
							component="div"
						>
							{opportunity.title}
						</Typography>
					}
					subheader={
						<Box
							sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}
						>
							<Chip
								label={opportunity.type}
								size="small"
								color={getStatusColor(opportunity.type)}
							/>
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Posted{" "}
								{formatDistanceToNow(new Date(opportunity.createdAt), {
									addSuffix: true,
								})}
							</Typography>
						</Box>
					}
				/>

				<Menu
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					transformOrigin={{ horizontal: "right", vertical: "top" }}
					anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
				>
					{isOrganizer && [
						opportunity.registrationForm ? (
							<MenuItem
								key="view-registrations"
								onClick={() => handleViewResponses("REGISTRATION")}
								disabled={loadingResponses}
							>
								<ListItemIcon>
									<ListAltIcon fontSize="small" />
								</ListItemIcon>
								{loadingResponses ? "Loading..." : "View Registrations"}
							</MenuItem>
						) : (
							<MenuItem
								key="create-registration"
								onClick={() => handleCreateForm("REGISTRATION")}
							>
								<ListItemIcon>
									<AssignmentIcon fontSize="small" />
								</ListItemIcon>
								Create Registration Form
							</MenuItem>
						),
					]}
					<MenuItem
						key="delete"
						onClick={handleDelete}
						sx={{ color: "error.main" }}
					>
						<ListItemIcon>
							<DeleteIcon
								fontSize="small"
								color="error"
							/>
						</ListItemIcon>
						Delete Opportunity
					</MenuItem>
					,
					<MenuItem key="share">
						<ListItemIcon>
							<AssignmentIcon fontSize="small" />
						</ListItemIcon>
						share
					</MenuItem>
				</Menu>

				<CardContent>
					<Typography
						variant="body2"
						color="text.secondary"
						paragraph
					>
						{opportunity.description}
					</Typography>

					<Box sx={{ mb: 2 }}>
						<Typography
							variant="subtitle2"
							color="text.secondary"
							gutterBottom
						>
							Rounds:
						</Typography>
						<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
							{opportunity.rounds.map((round, index) => (
								<Chip
									key={index}
									label={`${round.type}${
										round.testType ? ` - ${round.testType}` : ""
									}`}
									size="small"
									color={
										index === opportunity.currentRound ? "primary" : "default"
									}
									variant={
										index === opportunity.currentRound ? "filled" : "outlined"
									}
								/>
							))}
						</Box>
					</Box>

					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Chip
							icon={<PeopleIcon />}
							label={`${opportunity.participants?.length || 0} Participants`}
							size="small"
							variant="outlined"
						/>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							Current Round: {opportunity.currentRound + 1}/
							{opportunity.rounds.length}
						</Typography>
					</Box>
				</CardContent>

				<CardActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
					<Button
						startIcon={<InfoIcon />}
						variant="contained"
						color="primary"
						onClick={handleOpenDetails}
					>
						View Details
					</Button>
					<Button
						startIcon={<AssignmentTurnedInIcon />}
						variant="outlined"
						color="secondary"
						disabled={!isOpportunityOpen() || isRegistered}
						onClick={handleApplyClick}
					>
						{isStudentPresent
							? "Already Applied"
							: isOpportunityOpen()
							? "Apply Now"
							: "Applications Closed"}
					</Button>
				</CardActions>
			</Card>

			{/* Add Details Dialog */}
			<Dialog
				open={detailsOpen}
				onClose={handleCloseDetails}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>{opportunity.title}</DialogTitle>
				<DialogContent>
					<Tabs
						value={currentTab}
						onChange={handleTabChange}
						sx={{ mb: 2 }}
					>
						<Tab label="Overview" />
						<Tab label="Rounds" />
						<Tab label="Requirements" />
					</Tabs>

					{currentTab === 0 && (
						<Overview description={opportunity.description} />
					)}
					{currentTab === 1 && (
						<Rounds
							rounds={opportunity.rounds}
							currentRound={opportunity.currentRound}
							opportunity={opportunity}
						/>
					)}
					{currentTab === 2 && (
						<Requirements requirements={opportunity.requirements} />
					)}
				</DialogContent>
			</Dialog>

			<Dialog
				open={isFormRegisterOpen}
				onClose={() => setIsFormRegisterOpen(false)}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle>Create Form</DialogTitle>
				<DialogContent>
					<FormCreator
						entityId={opportunity._id}
						entityType="Opportunity"
						onClose={() => setIsFormRegisterOpen(false)}
						formType={formType}
					/>
				</DialogContent>
			</Dialog>
			{/* Add before the final closing tag */}
			<Dialog
				open={isRegisterDialogOpen}
				onClose={() => setRegisterDialogOpen(false)}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle>Register for {opportunity.title}</DialogTitle>
				<DialogContent>
					<DynamicRegistrationForm
						entityType="Opportunity"
						entityId={opportunity._id}
						userId={user?._id}
						onClose={() => setRegisterDialogOpen(false)}
						onRegister={handleRegister}
					/>
				</DialogContent>
			</Dialog>

			<ResponseDialog
				open={responseDialogOpen}
				onClose={() => setResponseDialogOpen(false)}
				title={`${
					responseType === "REGISTRATION" ? "Registration" : "Feedback"
				} Responses`}
				responses={responses}
				loading={loadingResponses}
				error={responsesError}
				entityId={opportunity._id}
				entityType="Opportunity"
				formType={responseType}
				onFilteredUsers={handleFilteredUsers}
				onMoveToNextRound={handleMoveToNextRound}
			/>
		</>
	);
};

export default OpportunityCard;
