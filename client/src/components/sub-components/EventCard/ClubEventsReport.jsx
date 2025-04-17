import React, { useState, useEffect } from "react";
import {
	Container,
	Paper,
	Typography,
	Grid,
	Box,
	Tabs,
	Tab,
	CircularProgress,
	Alert,
	Chip,
	Card,
	CardContent,
	IconButton,
	TextField,
	InputAdornment,
} from "@mui/material";
import {
	Search,
	FilterList,
	Assessment,
	Download,
	Event as EventIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../../../routes/apiConfig";

const ClubEventsReport = () => {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filter, setFilter] = useState("all"); // all, completed, ongoing
	const [searchQuery, setSearchQuery] = useState("");
	const user = useSelector((state) => state.auth.user);

	useEffect(() => {
		fetchEvents();
	}, []);

	const fetchEvents = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/events/club-reports`);
			setEvents(response.data.events);
		} catch (err) {
			setError(err.message || "Failed to fetch events");
		} finally {
			setLoading(false);
		}
	};

	const filterEvents = (events) => {
		return events
			.filter((event) => {
				if (filter === "completed")
					return new Date(event.eventDateTime) < new Date();
				if (filter === "ongoing")
					return new Date(event.eventDateTime) >= new Date();
				return true;
			})
			.filter(
				(event) =>
					event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					event.organizer?.clubName
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
			);
	};

	const EventCard = ({ event }) => {
		const [showReport, setShowReport] = useState(false);

		return (
			<Card
				elevation={2}
				sx={{ mb: 2 }}
			>
				<CardContent>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="start"
					>
						<Box>
							<Typography
								variant="h6"
								gutterBottom
							>
								{event.title}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
							>
								Organized by: {event.organizer?.clubName}
							</Typography>
							<Box mt={1}>
								<Chip
									size="small"
									label={event.eventType}
									color="primary"
									variant="outlined"
								/>
								<Chip
									size="small"
									label={
										new Date(event.eventDateTime) < new Date()
											? "Completed"
											: "Upcoming"
									}
									color={
										new Date(event.eventDateTime) < new Date()
											? "success"
											: "warning"
									}
									sx={{ ml: 1 }}
								/>
							</Box>
						</Box>
						<Box>
							<IconButton
								color="primary"
								onClick={() => setShowReport(true)}
								disabled={new Date(event.eventDateTime) >= new Date()}
							>
								<Assessment />
							</IconButton>
							{event.report && (
								<IconButton
									color="primary"
									onClick={() => window.open(event.report, "_blank")}
								>
									<Download />
								</IconButton>
							)}
						</Box>
					</Box>
				</CardContent>
			</Card>
		);
	};

	if (loading) return <CircularProgress />;
	if (error) return <Alert severity="error">{error}</Alert>;

	const filteredEvents = filterEvents(events);

	return (
		<Container
			maxWidth="lg"
			sx={{ py: 4 }}
		>
			<Typography
				variant="h4"
				gutterBottom
			>
				Club Events Reports
			</Typography>

			<Box sx={{ mb: 4 }}>
				<Grid
					container
					spacing={2}
					alignItems="center"
				>
					<Grid
						item
						xs={12}
						md={6}
					>
						<TextField
							fullWidth
							variant="outlined"
							placeholder="Search events or clubs..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Search />
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						md={6}
					>
						<Tabs
							value={filter}
							onChange={(_, newValue) => setFilter(newValue)}
							variant="fullWidth"
						>
							<Tab
								label="All Events"
								value="all"
							/>
							<Tab
								label="Completed"
								value="completed"
							/>
							<Tab
								label="Ongoing"
								value="ongoing"
							/>
						</Tabs>
					</Grid>
				</Grid>
			</Box>

			{filteredEvents.length === 0 ? (
				<Alert severity="info">No events found matching your criteria</Alert>
			) : (
				<Grid
					container
					spacing={3}
				>
					{filteredEvents.map((event) => (
						<Grid
							item
							xs={12}
							key={event._id}
						>
							<EventCard event={event} />
						</Grid>
					))}
				</Grid>
			)}
		</Container>
	);
};

export default ClubEventsReport;
