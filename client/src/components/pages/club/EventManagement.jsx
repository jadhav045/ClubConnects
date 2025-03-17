import React, { useState } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
} from "@mui/material";
import CreateEventForm from "../../form/CreateEventForm";
import { useDispatch, useSelector } from "react-redux";
import useAllEvents from "../../../hooks/useAllEvents";
import { getPresidentClubId } from "../../../hooks/getPresidantClubId";
import EventCard from "../../sub-components/EventCard";

const EventManagement = () => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	// Fetch all events from store
	const { events } = useSelector((store) => store.event);
	const { user } = useSelector((store) => store.auth);
	useAllEvents();

	// Get the club ID of the president
	const presidentClubId = getPresidentClubId(user);

	// States for filtering events
	const [selectedEventType, setSelectedEventType] = useState("");
	const [selectedRegistrationStatus, setSelectedRegistrationStatus] =
		useState("");

	// Filter events organized by the president's club
	const filteredEvents = events.filter((event) => {
		const isOrganizer = event?.organizer === presidentClubId;
		const matchesEventType = selectedEventType
			? event.eventType === selectedEventType
			: true;
		const matchesStatus = selectedRegistrationStatus
			? event.registrationStatus === selectedRegistrationStatus
			: true;

		return isOrganizer && matchesEventType && matchesStatus;
	});

	return (
		<div style={{ padding: "20px" }}>
			{/* Header Section */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 4,
				}}
			>
				<div>
					<Typography
						variant="h4"
						gutterBottom
					>
						My Club Events
					</Typography>
					<Typography
						variant="body1"
						color="textSecondary"
					>
						Manage events organized by your club
					</Typography>
				</div>
				<Button
					variant="contained"
					onClick={() => setIsDialogOpen(true)}
				>
					Create New Event
				</Button>
			</Box>

			{/* Filter Controls */}
			<Box sx={{ mb: 4, display: "flex", gap: 3, flexWrap: "wrap" }}>
				{/* Event Type Filter */}
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel>Event Type</InputLabel>
					<Select
						value={selectedEventType}
						onChange={(e) => setSelectedEventType(e.target.value)}
						label="Event Type"
					>
						<MenuItem value="">All Types</MenuItem>
						<MenuItem value="CULTURAL">Cultural</MenuItem>
						<MenuItem value="TECH">Tech</MenuItem>
						<MenuItem value="EDUCATION">Education</MenuItem>
						<MenuItem value="SPORTS">Sports</MenuItem>
						<MenuItem value="SEMINAR">Seminar</MenuItem>
						<MenuItem value="OTHER">Other</MenuItem>
					</Select>
				</FormControl>

				{/* Registration Status Filter */}
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel>Registration Status</InputLabel>
					<Select
						value={selectedRegistrationStatus}
						onChange={(e) => setSelectedRegistrationStatus(e.target.value)}
						label="Registration Status"
					>
						<MenuItem value="">All Statuses</MenuItem>
						<MenuItem value="OPEN">Open</MenuItem>
						<MenuItem value="CLOSED">Closed</MenuItem>
						<MenuItem value="CANCELLED">Cancelled</MenuItem>
					</Select>
				</FormControl>
			</Box>

			{/* Events Grid */}
			{filteredEvents.length > 0 ? (
				<Grid
					container
					spacing={4}
				>
					{filteredEvents.map((event) => (
						<Grid
							item
							key={event._id}
							xs={12}
							sm={6}
							md={4}
						>
							<EventCard
								event={event}
								userId={user._id}
								showAdminControls={true}
							/>
						</Grid>
					))}
				</Grid>
			) : (
				<Typography
					variant="h6"
					sx={{ mt: 4, color: "text.secondary" }}
				>
					No events found for your club
				</Typography>
			)}

			{/* Create Event Dialog */}
			<CreateEventForm
				open={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onSuccess={() => console.log("Form submitted successfully")}
			/>
		</div>
	);
};

export default EventManagement;
