import React, { useState, useEffect, useRef } from "react";
import { Button, IconButton, Typography } from "@mui/material";
import {
	MoreVert,
	Event,
	LocationOn,
	Person,
	HourglassEmpty,
	Description,
	Assessment,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useEventCard } from "./EventCardFn";
import ResponseDialog from "../form/ResponseDialog";
import { API_URL, getRole, getToken } from "../../routes/apiConfig";
import EventDetailModal from "./EventCard/EventDetailModal";
import EventDialogs from "./EventCard/EventDialogs";
import EventOptionsMenu, {
	UploadReportModal,
} from "./EventCard/EventOptionsMenu";
import EventStatusAction from "./EventCard/EventStatusAction";
// import { AttendanceCodeDialog } from "./EventCard/AttendanceCodeDialog";
import { useEventAttendance } from "./hooks/useEventAttendance";
import FeedbackDialog from "./EventCard/FeedbackDialog";
import AttendanceListDialog from "./EventCard/AttendantListDialog";
import EventReport from "./EventCard/EventReport";
// import AttendanceListDialog from './EventCard/AttendanceListDialog';

const EventCard = ({ event, userId }) => {
	const navigate = useNavigate();
	const [tab, setTab] = useState(0);

	const [isFormRegisterOpen, setIsFormRegisterOpen] = useState(false);
	const [formType, setFormType] = useState("");
	const [responseDialogOpen, setResponseDialogOpen] = useState(false);
	const [responses, setResponses] = useState([]);
	const [loadingResponses, setLoadingResponses] = useState(false);
	const [responsesError, setResponsesError] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const [showDetails, setShowDetails] = useState(false);
	const [isDialogVisible, setIsDialogVisible] = useState(false);
	const [message, setMessage] = useState("");
	const [isRegister, setIsRegister] = useState(false);
	const [hasGivenFeedback, setHasGivenFeedback] = useState(false);

	const [attendanceCode, setAttendanceCode] = useState("");
	const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
	const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
	const [showAttendanceList, setShowAttendanceList] = useState(false);

	useEffect(() => {
		const checkEventStatus = async () => {
			if (!event?._id || !userId) return;

			try {
				const token = getToken();

				// Check both registration and feedback status in parallel
				const [registrationRes, feedbackRes] = await Promise.all([
					axios.post(
						`${API_URL}/student/events/${event._id}/form-status`,
						{ type: "REGISTRATION" },
						{ headers: { Authorization: `Bearer ${token}` } }
					),
					axios.post(
						`${API_URL}/student/events/${event._id}/form-status`,
						{ type: "FEEDBACK" },
						{ headers: { Authorization: `Bearer ${token}` } }
					),
				]);

				// Update both states
				console.log("RES", isRegister);
				console.log("FEE", hasGivenFeedback);
				setIsRegister(registrationRes?.data?.filled || false);
				setHasGivenFeedback(feedbackRes?.data?.filled || false);
				console.log("RES", isRegister);
				console.log("FEE", hasGivenFeedback);
			} catch (error) {
				console.error("Error checking event status:", error);
			}
		};

		checkEventStatus();
	}, [event?._id, userId]);

	// console.log("At EvebT", userId);
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

	const {
		hasGivenAttendance,
		showAttendanceDialog,
		setShowAttendanceDialog,
		handleGenerateAttendanceCode,
		handleSubmitAttendanceCode,
		isLoading,
	} = useEventAttendance(event, userId);

	// const isRegistered = user?.eventParticipated?.includes(event._id);

	const isEventClosed = () =>
		event.registrationStatus !== "OPEN" ||
		new Date() > new Date(event.registrationDeadline);

	const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);

	const handleDialogOpen = () => setIsDialogVisible(true);
	const handleDialogClose = () => {
		setIsDialogVisible(false);
		setMessage("");
	};

	const handleCreateForm = (type) => {
		setFormType(type);
		handleMenuClose();
		setIsFormRegisterOpen(true);
	};

	const handleSendReminder = async () => {
		try {
			console.log("Data", event.attendance);
			const res = await axios.post(
				`http://localhost:3002/student/club/sendReminder/${event._id}`,
				{ message },
				{ withCredentials: true }
			);
			alert("Reminder sent successfully!");
			handleDialogClose();
		} catch (err) {
			console.error("Error sending reminder:", err);
			alert("Failed to send reminder");
		}
	};

	const handleViewResponses = async (type) => {
		try {
			handleMenuClose();
			setLoadingResponses(true);

			const res = await axios.get(
				`http://localhost:3002/form/Event/${event._id}/${type}`
			);

			setResponses(res.data);
			setResponseDialogOpen(true);
		} catch (err) {
			console.error("Error fetching responses:", err.message);
			setResponsesError("Error loading responses.");
		} finally {
			setLoadingResponses(false);
		}
	};

	const formatDateTime = (dateStr) => {
		return new Date(dateStr).toLocaleString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getDaysRemaining = () => {
		if (!event.registrationDeadline) return null;
		const diff = new Date(event.registrationDeadline) - new Date();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	};

	const [showModal, setShowModal] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const fileInputRef = useRef();

	const handleFileChange = (e) => {
		setSelectedFile(e.target.files[0]);
	};

	const handleFileUpload = async (e) => {
		console.log("evnt", event);
		e.preventDefault();
		if (!selectedFile) return alert("No file selected.");

		const formData = new FormData();
		formData.append("file", selectedFile);

		// Check the contents of FormData
		formData.forEach((value, key) => {
			console.log(`${key}:`, value);
		});

		const token = getToken();
		try {
			const response = await axios.post(
				`${API_URL}/student/events/${event._id}/addReport`,
				formData, // Pass FormData directly as the second argument
				{
					headers: {
						Authorization: `Bearer ${token}`,
						// No need to specify Content-Type; axios will handle it automatically
					},
				}
			);

			if (!response.success) throw new Error("Upload failed");

			alert("Report uploaded successfully!");
			setShowModal(false);
			setSelectedFile(null);
		} catch (error) {
			console.error("Error uploading file:", error);
			alert("File upload failed.");
		}
	};

	const handleSubmitFeedback = async (feedbackData) => {
		try {
			setIsFeedbackLoading(true);
			const token = getToken();

			const response = await axios.post(
				`${API_URL}/events/${event._id}/feedback`,
				{
					...feedbackData,
					userId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.data.success) {
				setHasGivenFeedback(true);
				alert("Thank you for your feedback!");
				setShowFeedbackDialog(false);
			}
		} catch (error) {
			console.error("Error submitting feedback:", error);
			alert("Failed to submit feedback. Please try again.");
		} finally {
			setIsFeedbackLoading(false);
		}
	};

	const userRole = getRole();
	// console.log("Role", userRole);
	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};
	// Add this helper function in the EventCard component
	const isEventCompleted = () => {
		const eventEndTime = new Date(event.eventDateTime);
		const now = new Date();
		return now > eventEndTime;
	};

	useEffect(() => {
		if (event?.participants) {
			setIsRegister(event.participants.includes(userId));
		}
	}, [event.participants, userId]);

	const daysRemaining = getDaysRemaining();
	const deadline =
		daysRemaining > 0
			? `${daysRemaining} days remaining`
			: "Registration closed";

	const isEventOver = () => {
		return new Date(event.eventDateTime) < new Date(); // true if event is in the past
	};

	const isEventStarted = () => {
		const eventTime = new Date(event.eventDateTime);
		const now = new Date();
		return now >= eventTime;
	};

	const handleGiveAttendance = () => {
		setShowAttendanceDialog(true);
	};
	const [showReport, setShowReport] = useState(false);

	return (
		<div className="rounded-lg border border-gray-200 overflow-hidden shadow-md bg-white max-w-3xl mx-auto hover:shadow-lg transition duration-300">
			{/* Card Header with Event Type Badge */}
			<div className="relative">
				<div className="absolute top-4 right-4 z-10">
					<span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
						{event.eventType}
					</span>
				</div>

				{/* Event Cover Image - Using a placeholder gradient if no image */}
				<div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
			</div>

			{/* Card Content */}
			<div className="p-5">
				<div className="flex justify-between items-start">
					<h2 className="text-xl font-bold text-gray-900 mb-1">
						{event.title}
					</h2>
					<IconButton
						onClick={handleMenuClick}
						className="text-gray-600 hover:bg-gray-100"
						size="small"
						aria-label="more options"
					>
						<MoreVert />
					</IconButton>
				</div>

				{/* Event Description */}
				<p className="text-gray-700 text-sm mb-4 line-clamp-2">
					{event.description}
				</p>

				{/* Event Details */}
				<div className="space-y-3 mb-4">
					<div className="flex items-center text-gray-700">
						<Event
							className="text-indigo-600 mr-2"
							fontSize="small"
						/>
						<span className="text-sm">
							{formatDateTime(event.eventDateTime)}
						</span>
					</div>
					<div className="flex items-center text-gray-700">
						<LocationOn
							className="text-indigo-600 mr-2"
							fontSize="small"
						/>
						<span className="text-sm">{event.location}</span>
					</div>

					{(userRole === "Faculty" || isOrganizer) && isEventCompleted() ? (
						<div className="flex items-center text-gray-700 mt-4">
							<Assessment
								className="text-indigo-600 mr-2"
								fontSize="small"
							/>
							<div className="flex flex-1 gap-3 items-center">
								<span className="text-sm">Event Report</span>
								<div className="flex gap-2 ml-auto">
									<button
										onClick={() => window.open(event.report, "_blank")}
										className="flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
									>
										Open Report
									</button>
									<button
										onClick={() => setShowReport(true)}
										className="flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
									>
										View Stats
									</button>
								</div>
							</div>
						</div>
					) : (
						isOrganizer && (
							<div className="flex items-center text-gray-700 mt-4">
								<HourglassEmpty
									className="text-orange-600 mr-2"
									fontSize="small"
								/>
								<span className="text-sm text-gray-600">
									Reports available after event completion
								</span>
							</div>
						)
					)}

					<div className="flex items-center text-gray-700">
						<Person
							className="text-indigo-600 mr-2"
							fontSize="small"
						/>
						<span className="text-sm">
							Organized by{" "}
							<Link
								to={`/${getRole()}/clubs/${event.organizer?._id}`}
								className="text-indigo-600 hover:text-indigo-800 font-medium"
							>
								{event.organizer?.clubName || "Unknown Club"}
							</Link>
						</span>
					</div>
					{event.registrationDeadline && (
						<div className="flex items-center text-gray-700">
							<HourglassEmpty
								className="text-indigo-600 mr-2"
								fontSize="small"
							/>
							<span
								className={`text-sm ${
									daysRemaining <= 3 && daysRemaining > 0
										? "text-orange-600 font-medium"
										: daysRemaining <= 0
										? "text-red-600"
										: ""
								}`}
							>
								{deadline}
							</span>
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex gap-3 pt-2 justify-between items-center border-t border-gray-100 pt-4">
					<button
						onClick={() => setShowDetails(true)}
						className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
					>
						<Description
							fontSize="small"
							className="mr-1"
						/>
						View Details
					</button>

					{/* <AttendanceCodeDialog
						open={showAttendanceDialog}
						onClose={() => setShowAttendanceDialog(false)}
						onSubmit={
							isOrganizer
								? handleGenerateAttendanceCode
								: handleSubmitAttendanceCode
						}
						isOrganizer={isOrganizer}
						isLoading={isLoading}
					/> */}

					<EventStatusAction
						isRegistered={isRegister}
						isEventStarted={isEventStarted()}
						hasGivenAttendance={hasGivenAttendance}
						hasGivenFeedback={hasGivenFeedback}
						isEventClosed={isEventClosed()}
						onRegister={() => setRegisterDialogOpen(true)}
						onGiveAttendance={handleGiveAttendance}
						isOrganizer={isOrganizer}
						isAttendanceOpen={event.isAttendanceOpen}
						onOpenAttendance={() => setShowAttendanceDialog(true)}
						onGiveFeedback={() => setShowFeedbackDialog(true)}
					/>
				</div>
			</div>

			<EventOptionsMenu
				anchorEl={anchorEl}
				handleMenuClose={handleMenuClose}
				isOrganizer={isOrganizer}
				event={event}
				handleViewResponses={handleViewResponses}
				handleCreateForm={handleCreateForm}
				handleDialogOpen={handleDialogOpen}
				onViewAttendance={() => setShowAttendanceList(true)}
			/>

			{showReport && (
				<EventReport
					eventId={event._id}
					onClose={() => setShowReport(false)}
				/>
			)}

			<UploadReportModal
				show={showModal}
				onClose={() => setShowModal(false)}
				onSubmit={handleFileUpload}
				onFileChange={handleFileChange}
			/>
			{/*  */}
			<EventDialogs
				isDialogVisible={isDialogVisible}
				handleDialogClose={handleDialogClose}
				message={message}
				setMessage={setMessage}
				handleSendReminder={handleSendReminder}
				open={open}
				handleClose={handleClose}
				tab={tab}
				setTab={setTab}
				event={event}
				isFormRegisterOpen={isFormRegisterOpen}
				setIsFormRegisterOpen={setIsFormRegisterOpen}
				formType={formType}
				isRegisterDialogOpen={isRegisterDialogOpen}
				setRegisterDialogOpen={setRegisterDialogOpen}
				userId={userId}
				handleRegister={handleRegister}
			/>

			{/* Response Dialog */}
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

			{/* Full Event Details Modal */}
			{showDetails && (
				<EventDetailModal
					event={event}
					onClose={() => setShowDetails(false)}
				/>
			)}

			<FeedbackDialog
				open={showFeedbackDialog}
				onClose={() => setShowFeedbackDialog(false)}
				onSubmit={handleSubmitFeedback}
				isLoading={isFeedbackLoading}
				event={event}
			/>

			<AttendanceListDialog
				open={showAttendanceList}
				onClose={() => setShowAttendanceList(false)}
				event={event}
			/>
		</div>
	);
};

export default EventCard;
