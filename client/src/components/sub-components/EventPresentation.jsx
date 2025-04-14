import React from "react";
import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
	Box,
	Typography,
} from "@mui/material";
import EventCard from "./EventCard";
import { getUser } from "../../routes/apiConfig";
// import EventCard from "../../../sub-components/EventCard";

const EventsPresentation = ({
	filteredEvents,
	selectedEventType,
	setSelectedEventType,
	selectedRegistrationStatus,
	setSelectedRegistrationStatus,
}) => {
	const user = getUser();
	const userId = user._id;
	// console.log(userId);
	return (
		<div style={{ padding: "20px" }}>
			<Typography
				variant="h4"
				gutterBottom
				sx={{ mb: 4 }}
			>
				Upcoming Events
			</Typography>

			<Box sx={{ mb: 4, display: "flex", gap: 3, flexWrap: "wrap" }}>
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

			{filteredEvents?.length > 0 ? (
				<Grid
					container
					spacing={4}
				>
					{filteredEvents.map((event) => (
						<Grid
							item
							key={event?._id}
							xs={12}
							sm={6}
							md={4}
						>
							<EventCard
								event={event}
								userId={userId}
							/>
						</Grid>
					))}
				</Grid>
			) : (
				<Typography
					variant="h6"
					sx={{ mt: 4, color: "text.secondary" }}
				>
					No events found matching your criteria
				</Typography>
			)}
		</div>
	);
};

export default EventsPresentation;
