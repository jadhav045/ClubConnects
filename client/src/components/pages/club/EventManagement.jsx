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

// Sub-component: EventManagement Header
const EventManagementHeader = ({ onCreateEvent }) => (
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
			onClick={onCreateEvent}
		>
			Create New Event
		</Button>
	</Box>
);

// Sub-component: Event Filters
const EventFilters = ({
	eventType,
	onEventTypeChange,
	registrationStatus,
	onRegistrationStatusChange,
}) => (
	<Box sx={{ mb: 4, display: "flex", gap: 3, flexWrap: "wrap" }}>
		<FormControl sx={{ minWidth: 200 }}>
			<InputLabel>Event Type</InputLabel>
			<Select
				value={eventType}
				onChange={onEventTypeChange}
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

		<FormControl sx={{ minWidth: 200 }}>
			<InputLabel>Registration Status</InputLabel>
			<Select
				value={registrationStatus}
				onChange={onRegistrationStatusChange}
				label="Registration Status"
			>
				<MenuItem value="">All Statuses</MenuItem>
				<MenuItem value="OPEN">Open</MenuItem>
				<MenuItem value="CLOSED">Closed</MenuItem>
				<MenuItem value="CANCELLED">Cancelled</MenuItem>
			</Select>
		</FormControl>
	</Box>
);

// Sub-component: Events Grid
const EventsGrid = ({ events, user }) => (
	<>
		{events.length > 0 ? (
			<Grid
				container
				spacing={4}
			>
				{events.map((event) => (
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
	</>
);

// Main Component
const EventManagement = () => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { events } = useSelector((store) => store.event);
	const { user } = useSelector((store) => store.auth);
	useAllEvents();

	// console.log("Evn",events);
	const presidentClubId = getPresidentClubId(user);

	// Filter states
	const [selectedEventType, setSelectedEventType] = useState("");
	const [selectedRegistrationStatus, setSelectedRegistrationStatus] =
		useState("");

	const filteredEvents = events.filter((event) => {
		const isOrganizer = event?.organizer._id === presidentClubId;
		// console.log("Event Organizer",  event?.organizer._id)
		const matchesEventType = selectedEventType
			? event.eventType === selectedEventType
			: true;
		const matchesStatus = selectedRegistrationStatus
			? event.registrationStatus === selectedRegistrationStatus
			: true;

		return isOrganizer && matchesEventType && matchesStatus;
	});
	console.log("Filter", filteredEvents);

	return (
		<div style={{ padding: "20px" }}>
			<EventManagementHeader onCreateEvent={() => setIsDialogOpen(true)} />

			<EventFilters
				eventType={selectedEventType}
				onEventTypeChange={(e) => setSelectedEventType(e.target.value)}
				registrationStatus={selectedRegistrationStatus}
				onRegistrationStatusChange={(e) =>
					setSelectedRegistrationStatus(e.target.value)
				}
			/>

			<EventsGrid
				events={filteredEvents}
				user={user}
			/>

			<CreateEventForm
				open={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onSuccess={() => console.log("Form submitted successfully")}
			/>
		</div>
	);
};

export default EventManagement;
