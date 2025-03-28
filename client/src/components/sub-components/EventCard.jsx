import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardActions,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	Tabs,
	Tab,
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
	Typography,
	ListItemText,
	Divider,
	ListItem,
} from "@mui/material";
import {
	Calendar,
	MapPin,
	User,
	Link,
	FileText,
	Info,
	BookOpen,
	Clock,
	Box,
	List,
} from "lucide-react";
import useCountdown from "./useCountdown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FeedbackIcon from "@mui/icons-material/Feedback";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StudentRegister from "../pages/club/event/StudentRegister";
import AppliedStudent from "../pages/club/event/AppliedStudent";
import { useEventCard } from "./EventCardFn";
import CreateEventForm from "../form/CreateEventForm";
import FormCreator from "../form/FormCreator";
import DynamicRegistrationForm from "../form/DynamicRegistrationForm";
import axios from "axios";
import ResponseDialog from "../form/ResponseDialog";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useSelector } from "react-redux";

const Overview = ({ description }) => (
	<p className="text-gray-700 leading-relaxed">{description}</p>
);

const Schedule = ({ schedule }) => {
	if (!schedule || schedule.length === 0) return null;

	return (
		<div style={{ marginTop: "10px" }}>
			<Typography
				variant="subtitle1"
				style={{ fontWeight: "bold" }}
			>
				Event Schedule
			</Typography>
			<Divider style={{ marginBottom: "5px" }} />
			{schedule.map((item, index) => (
				<div
					key={index}
					style={{ marginBottom: "5px" }}
				>
					<Typography variant="body2">
						<strong>Time:</strong> {item.time} | <strong>Activity:</strong>{" "}
						{item.activity}
					</Typography>
				</div>
			))}
		</div>
	);
};

const Resources = ({ resources }) =>
	// ...existing Resources component code...
	console.log("Reso");

const EventCard = ({ event, userId }) => {
	const [responseDialogOpen, setResponseDialogOpen] = useState(false);
	const [responseType, setResponseType] = useState("REGISTRATION");
	const [responses, setResponses] = useState([]);
	const [loadingResponses, setLoadingResponses] = useState(false);
	const [responsesError, setResponsesError] = useState("");
	// const { user } = useSelector((store) => store.auth);

	const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
	const [isFormRegisterOpen, setIsFormRegisterOpen] = useState(false);

	const [formType, setFormType] = useState("");
	const {
		open,
		tab,
		isRegisterDialogOpen,
		isViewAppliedDialogOpen,
		anchorEl,
		openMenu,
		isOrganizer,
		user,
		handleOpen,
		handleClose,
		handleTabChange,
		handleClick,
		handleMenuClick,
		handleMenuClose,

		handleViewFeedback,
		handleShare,
		handleRegister,
		useCountdown,
		setRegisterDialogOpen,
		setViewAppliedDialogOpen,
	} = useEventCard(event);

	const handleViewResponses = async (type) => {
		try {
			handleMenuClose();
			setLoadingResponses(true);
			setResponsesError("");
			setResponseType(type);

			const response = await axios.get(
				`http://localhost:3002/form/Event/${event._id}/${type}`
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

	const timeLeft = useCountdown(event?.countdownTime);

	const handleCreateForm = (formType) => {
		setFormType(formType);
		handleMenuClose();
		setIsFormRegisterOpen(true);
	};

	const eventDate = new Date(event?.eventDateTime);
	const formattedDate = eventDate.toLocaleDateString("en-US", {
		weekday: "short", // e.g., Sun
		year: "numeric",
		month: "short", // e.g., Mar
		day: "2-digit", // e.g., 23
	});
	const formattedTime = eventDate.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true, // Convert to AM/PM format
	});

	const isRegistered = user?.eventParticipated?.includes(event._id);

	return (
		<>
			<Card className="max-w-2xl mx-auto shadow-2xl rounded-3xl bg-gradient-to-br from-indigo-100 to-white">
				<CardHeader
					title={event?.title}
					subheader={event?.eventType}
					className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-t-3xl"
					action={
						<IconButton
							aria-label="settings"
							onClick={handleMenuClick}
							sx={{ color: "white" }} // Explicit white color
						>
							<MoreVertIcon />
						</IconButton>
					}
				/>

				<Menu
					anchorEl={anchorEl}
					open={openMenu}
					onClose={handleMenuClose}
					MenuListProps={{
						"aria-labelledby": "basic-button",
					}}
				>
					{isOrganizer && [
						event.registrationForm ? (
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

						event.feedbackForm ? (
							<MenuItem
								key="view-feedback"
								onClick={() => handleViewResponses("FEEDBACK")}
								disabled={loadingResponses}
							>
								<ListItemIcon>
									<FeedbackIcon fontSize="small" />
								</ListItemIcon>
								{loadingResponses ? "Loading..." : "View Feedback"}
							</MenuItem>
						) : (
							<MenuItem
								key="create-feedback"
								onClick={() => handleCreateForm("FEEDBACK")}
							>
								<ListItemIcon>
									<FeedbackIcon fontSize="small" />
								</ListItemIcon>
								Create Feedback Form
							</MenuItem>
						),
					]}

					<MenuItem onClick={handleShare}>
						<ListItemIcon>
							<ShareIcon fontSize="small" />
						</ListItemIcon>
						Share Event
					</MenuItem>
				</Menu>

				<CardContent className="space-y-6 p-8">
					<p className="text-gray-600 text-lg leading-relaxed">
						{event?.description}
					</p>
					<div className="flex items-center gap-4">
						<Calendar className="w-6 h-6 text-indigo-500" />
						<span className="text-lg font-medium text-gray-700">
							{formattedDate} — {formattedTime}
						</span>
					</div>

					<div className="flex items-center gap-4">
						<MapPin className="w-6 h-6 text-red-500" />
						<span className="text-lg font-medium text-gray-700">
							{event?.location}
						</span>
					</div>
					<div className="flex items-center gap-4">
						<User className="w-6 h-6 text-green-500" />
						<span className="text-lg font-medium text-gray-700">
							Organized by {event?.organizer?.clubName}
						</span>
						{/* <span>EventId {event._id}</span> */}
					</div>

					<div className="flex items-center gap-4">
						<Clock className="w-6 h-6 text-yellow-500" />
						<span>{useCountdown(new Date(event?.registrationDeadline))}</span>
					</div>
				</CardContent>

				<CardActions className="p-6 border-t border-indigo-200 flex justify-between">
					<Button
						onClick={handleOpen}
						variant="contained"
						color="primary"
						className="rounded-full"
					>
						<Info className="mr-2" /> View Details
					</Button>
					<Button
						onClick={handleClick}
						variant="outlined"
						color="secondary"
						className="rounded-full"
						disabled={
							user?.role !== "Faculty" &&
							user?.role !== "Alumni" &&
							isRegistered
						} // Disable if user is already registered
					>
						<BookOpen className="mr-2" />
						{user?.role === "Faculty" || user?.role === "Alumni"
							? "View Applied Students"
							: isRegistered
							? "Already Registered"
							: "Register Now"}
					</Button>
				</CardActions>
			</Card>

			<Dialog
				open={open}
				onClose={handleClose}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle className="bg-indigo-500 text-white">
					Event Details
				</DialogTitle>
				<DialogContent className="p-6">
					<Tabs
						value={tab}
						onChange={handleTabChange}
						className="mb-6"
					>
						<Tab label="Overview" />
						<Tab label="Schedule" />
						<Tab label="Resources" />
					</Tabs>
					{tab === 0 && <Overview description={event?.detailedDescription} />}
					{tab === 1 && <Schedule schedule={event?.schedule} />}
					{tab === 2 && <Resources resources={event?.resources} />}
				</DialogContent>
			</Dialog>

			<CreateEventForm
				open={isFormDialogOpen}
				onClose={() => setIsFormDialogOpen(false)}
				eventId={event._id}
			/>

			<Dialog
				open={isFormRegisterOpen}
				onClose={() => setIsFormRegisterOpen(false)}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle>Create Form</DialogTitle>
				<DialogContent>
					<FormCreator
						entityId={event._id}
						entityType="Event"
						onClose={() => setIsFormRegisterOpen(false)}
						formType={formType}
					/>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isRegisterDialogOpen}
				onClose={() => setRegisterDialogOpen(false)}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle>Student Registration</DialogTitle>
				<DialogContent>
					<DynamicRegistrationForm
						entityType="Event"
						entityId={event._id}
						userId={userId}
						onClose={() => setRegisterDialogOpen(false)} // Pass onClose prop
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
				entityId={event._id}
				entityType="Event"
				formType={responseType}
			/>
		</>
	);
};

export default EventCard;

// Let me know if you want me to refine anything else! 🚀
