import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Tabs,
	Tab,
	Button,
	IconButton,
	Menu,
	MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FeedbackIcon from "@mui/icons-material/Feedback";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link, useNavigate } from "react-router-dom";

import useCountdown from "./useCountdown";
import { useEventCard } from "./EventCardFn";
import CreateEventForm from "../form/CreateEventForm";
import FormCreator from "../form/FormCreator";
import DynamicRegistrationForm from "../form/DynamicRegistrationForm";
import ResponseDialog from "../form/ResponseDialog";
import { getRole } from "../../routes/apiConfig";
import axios from "axios";

const Overview = ({ description }) => (
	<p className="text-gray-700 leading-relaxed">{description}</p>
);

const Schedule = ({ schedule }) => (
	<div className="mt-2">
		<h3 className="text-lg font-semibold">Event Schedule</h3>
		{schedule?.map((item, i) => (
			<div
				key={i}
				className="text-sm text-gray-700"
			>
				{item.time} - {item.activity}
			</div>
		))}
	</div>
);

const EventCard = ({ event, userId }) => {
	const navigate = useNavigate();

	const [tab, setTab] = useState(0);
	const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
	const [isFormRegisterOpen, setIsFormRegisterOpen] = useState(false);
	const [formType, setFormType] = useState("");
	const [responseDialogOpen, setResponseDialogOpen] = useState(false);
	const [responses, setResponses] = useState([]);
	const [loadingResponses, setLoadingResponses] = useState(false);
	const [responsesError, setResponsesError] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);

	const {
		open,
		handleOpen,
		handleClose,
		isRegisterDialogOpen,
		setRegisterDialogOpen,
		handleRegister,
		user,
		isOrganizer,
	} = useEventCard(event);

	const isRegistered = user?.eventParticipated?.includes(event._id);
	// console.log(user.eventParticipated);
	const isEventClosed = () =>
		event.registrationStatus !== "OPEN" ||
		new Date() > new Date(event.registrationDeadline);

	const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);

	const [showDetails, setShowDetails] = useState(false);

	const handleCreateForm = (type) => {
		setFormType(type);
		handleMenuClose();
		setIsFormRegisterOpen(true);
	};
	const handleSendReminder = async () => {
		try {
			console.log("m");
			const res = await axios.post(
				`http://localhost:3002/student/club/sendReminder/${event._id}`,
				{
					message: "Reminder: TechFest 2025 is coming soon!",
				},
				{
					withCredentials: true, // if using cookies for auth
				}
			);

			console.log("Success:", res.data);
			alert("Reminder sent!");
		} catch (err) {
			console.error("Error sending reminder:", err);
			alert("Failed to send reminder");
		}
	};

	const handleViewResponses = async (type) => {
		try {
			console.log("Call- Handle");
			handleMenuClose();
			setLoadingResponses(true);
			console.log("Event ID:", event._id);

			const res = await axios.get(
				`http://localhost:3002/form/Event/${event._id}/${type}`
			);

			console.log("res-", res.data);
			setResponses(res.data);
			setResponseDialogOpen(true);
		} catch (err) {
			console.error("❌ Error fetching responses:", err.message);
			setResponsesError("Error loading responses.");
		} finally {
			setLoadingResponses(false);
		}
	};

	const {
		title,
		eventType,
		description,
		eventDateTime,
		location,
		registrationDeadline,
		organizer,
	} = event;
	const formatDateTime = (dateStr) => {
		return new Date(dateStr).toLocaleString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// const user = getUser()
	const getDaysRemaining = () => {
		if (!registrationDeadline) return null;
		const diff = new Date(registrationDeadline) - new Date();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	};

	const [isRegister, setIsRegister] = useState(false);

	useEffect(() => {
		if (event?.participants) {
			setIsRegister(event.participants.includes(userId));
		}
	}, [event.participants, userId]);

	return (
		<div className="rounded-2xl border border-gray-200 p-6 shadow-md bg-white max-w-3xl mx-auto space-y-4">
			<div className="flex justify-between items-start">
				<div>
					<h2 className="text-xl font-bold text-gray-900">{title}</h2>
					<p className="text-gray-500 text-sm">{eventType}</p>
				</div>
				<IconButton onClick={handleMenuClick}>
					<MoreVertIcon />
				</IconButton>
				<Menu
					anchorEl={anchorEl}
					open={!!anchorEl}
					onClose={handleMenuClose}
				>
					{isOrganizer && (
						<>
							{event.registrationForm ? (
								<MenuItem onClick={() => handleViewResponses("REGISTRATION")}>
									<ListAltIcon
										fontSize="small"
										className="mr-2"
									/>
									View Registrations
								</MenuItem>
							) : (
								<MenuItem onClick={() => handleCreateForm("REGISTRATION")}>
									<AssignmentIcon
										fontSize="small"
										className="mr-2"
									/>
									Create Registration Form
								</MenuItem>
							)}
							{event.feedbackForm ? (
								<MenuItem onClick={() => handleViewResponses("FEEDBACK")}>
									<FeedbackIcon
										fontSize="small"
										className="mr-2"
									/>
									View Feedback
								</MenuItem>
							) : (
								<MenuItem onClick={() => handleCreateForm("FEEDBACK")}>
									<FeedbackIcon
										fontSize="small"
										className="mr-2"
									/>
									Create Feedback Form
								</MenuItem>
							)}
						</>
					)}
					<MenuItem onClick={() => alert("Share logic")}>
						<ShareIcon
							fontSize="small"
							className="mr-2"
						/>
						Share
					</MenuItem>
					<MenuItem onClick={() => handleSendReminder()}>
						<ShareIcon
							fontSize="small"
							className="mr-2"
						/>
						Send Reminder
					</MenuItem>
				</Menu>
			</div>
			{/* Description */}
			<p className="text-gray-700 text-sm">{description}</p>

			{/* Details */}
			<div className="space-y-2 text-sm text-gray-700">
				<div className="flex items-center gap-2">
					📅
					<span>{formatDateTime(eventDateTime)}</span>
				</div>
				<div className="flex items-center gap-2">
					📍
					<span>{location}</span>
				</div>
				<div className="flex items-center gap-2">
					👤
					<span>
						Organized by{" "}
						<Link
							to={`/${getRole()}/clubs/${organizer?._id}`}
							className="text-blue-600 underline"
						>
							{organizer?.clubName || "Unknown Club"}
						</Link>
					</span>
				</div>
				<div className="flex items-center gap-2">
					📝 <span>Registration open</span>
				</div>
				{registrationDeadline && (
					<div className="flex items-center gap-2">
						⏳ <span>{getDaysRemaining()} days remaining</span>
					</div>
				)}
			</div>
			<div className="flex gap-3 pt-2 justify-end">
				<button
					onClick={() => setShowDetails(true)}
					className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
				>
					View Details
				</button>

				<button
					disabled={isEventClosed() || isRegistered}
					onClick={() => setRegisterDialogOpen(true)}
					className={`mt-2 px-4 py-2 rounded-md transition ${
						isEventClosed() || isRegistered
							? "bg-gray-400 text-white cursor-not-allowed"
							: "bg-gray-800 text-white hover:bg-gray-900"
					}`}
				>
					{isRegistered ? "Already Registered" : "Register"}
				</button>
			</div>

			{/* Event Details Dialog */}
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
						onChange={(_, val) => setTab(val)}
						className="mb-4"
					>
						<Tab label="Overview" />
						<Tab label="Schedule" />
					</Tabs>
					{tab === 0 && <Overview description={event.detailedDescription} />}
					{tab === 1 && <Schedule schedule={event.schedule} />}
				</DialogContent>
			</Dialog>

			{/* Create Form Dialog */}
			<Dialog
				open={isFormRegisterOpen}
				onClose={() => setIsFormRegisterOpen(false)}
				fullWidth
				maxWidth="md"
			>
				<DialogContent>
					<FormCreator
						entityId={event._id}
						entityType="Event"
						formType={formType}
						onClose={() => setIsFormRegisterOpen(false)}
					/>
				</DialogContent>
			</Dialog>

			{/* Registration Dialog */}
			<Dialog
				open={isRegisterDialogOpen}
				onClose={() => setRegisterDialogOpen(false)}
				fullWidth
				maxWidth="md"
			>
				<DialogTitle>Register</DialogTitle>
				<DialogContent>
					<DynamicRegistrationForm
						entityType="Event"
						entityId={event._id}
						userId={userId}
						onClose={() => setRegisterDialogOpen(false)}
						onRegister={handleRegister}
					/>
				</DialogContent>
			</Dialog>
			<ResponseDialog
				open={responseDialogOpen}
				onClose={() => setResponseDialogOpen(false)}
				title={`${formType} Responses`}
				responses={responses}
				loading={loadingResponses}
				error={responsesError}
				entityId={event._id}
				entityType="Event"
				formType={formType}
			/>

			{/* Popup Modal */}
			{showDetails && (
				<EventDetailModal
					event={event}
					onClose={() => setShowDetails(false)}
				/>
			)}
		</div>
	);
};

//
const EventDetailModal = ({ event, onClose }) => {
	if (!event) return null;

	const renderResource = (resource, index) => {
		switch (resource.fileType) {
			case "IMAGE":
				return (
					<div
						key={index}
						className="mb-3"
					>
						<p className="font-medium">{resource.description}</p>
						<img
							src={resource.fileUrl}
							alt={resource.description}
							className="w-full max-h-60 object-contain rounded"
						/>
					</div>
				);
			case "VIDEO":
				return (
					<div
						key={index}
						className="mb-3"
					>
						<p className="font-medium">{resource.description}</p>
						<video
							controls
							className="w-full rounded"
						>
							<source src={resource.fileUrl} />
							Your browser does not support the video tag.
						</video>
					</div>
				);
			case "DOCUMENT":
			case "URL":
				return (
					<div
						key={index}
						className="mb-3"
					>
						<p className="font-medium">{resource.description}</p>
						<a
							href={resource.fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 underline"
						>
							View Resource
						</a>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto pt-10">
			<div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold">{event.title}</h2>
					<button
						onClick={onClose}
						className="text-gray-600 text-lg"
					>
						✕
					</button>
				</div>

				<p className="text-gray-700 mb-4">{event.detailedDescription}</p>

				{/* Schedule */}
				{event.schedule?.length > 0 && (
					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">🗓 Schedule</h3>
						<ul className="list-disc ml-5 space-y-1">
							{event.schedule.map((item, idx) => (
								<li key={idx}>
									<strong>{item.time}:</strong> {item.activity}
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Resources */}
				{event.resources?.length > 0 && (
					<div>
						<h3 className="text-lg font-semibold mb-2">📂 Resources</h3>
						<div className="space-y-4">
							{event.resources.map((res, idx) => renderResource(res, idx))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default EventCard;
