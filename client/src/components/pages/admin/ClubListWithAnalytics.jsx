import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	Card,
	CardContent,
	Typography,
	CircularProgress,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Box,
	Divider,
} from "@mui/material";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	LineChart,
	Line,
} from "recharts";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import TimelineIcon from "@mui/icons-material/Timeline";
import BarChartIcon from "@mui/icons-material/BarChart";
// import EventBusyIcon from "@mui/icons-material/EventBusy";

const ClubAnalytics = () => {
	const { clubId } = useParams();
	const [clubAnalytics, setClubAnalytics] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`http://localhost:3002/auth/faculty/club-analytics/${clubId}`)
			.then((res) => res.json())
			.then((data) => {
				setClubAnalytics(data);
				setLoading(false);
			})

			.catch((error) => console.error("Error fetching analytics:", error));
	}, [clubId]);

	if (loading)
		return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;

	console.log("clubAnalytics",clubAnalytics);
	const monthlyTrendData = Object.entries(
		clubAnalytics?.monthlyEventTrend || {}
	).map(([month, count]) => ({ month, count }));

	return (
		<Box sx={{ padding: 4 }}>
			<Typography
				variant="h4"
				fontWeight={600}
				gutterBottom
			>
				Analytics Dashboard - {clubAnalytics?.club?.name || "Club Analytics"}
			</Typography>

			<Divider sx={{ mb: 3 }} />

			{/* Summary Cards */}
			<Grid
				container
				spacing={3}
			>
				{[
					{ title: "Total Members", value: clubAnalytics?.totalMembers || 0 },
					{ title: "Events Hosted", value: clubAnalytics?.eventsHosted || 0 },
					{
						title: "Upcoming Events",
						value: clubAnalytics?.upcomingEvents?.length || 0,
					},
				].map((item, index) => (
					<Grid
						item
						xs={12}
						md={4}
						key={index}
					>
						<Card elevation={3}>
							<CardContent>
								<Typography
									variant="subtitle2"
									color="text.secondary"
								>
									{item.title}
								</Typography>
								<Typography
									variant="h5"
									fontWeight={600}
								>
									{item.value}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			{/* Member Role Stats */}
			{(clubAnalytics?.memberRoleStats?.length || 0) > 0 ? (
				<>
					<Typography
						variant="h6"
						mt={5}
						mb={2}
					>
						Member Role Statistics
					</Typography>
					<Grid
						container
						spacing={2}
					>
						{clubAnalytics?.memberRoleStats?.map((role) => (
							<Grid
								item
								xs={12}
								sm={6}
								md={3}
								key={role?.role}
							>
								<Card elevation={2}>
									<CardContent>
										<Typography
											variant="subtitle1"
											fontWeight={500}
										>
											{role?.role || "Unknown Role"}
										</Typography>
										<Typography variant="body1">
											Count: {role?.count || 0}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											Ratio: {role?.ratio || 0}%
										</Typography>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</>
			) : (
				<Typography
					variant="body1"
					mt={5}
					color="text.secondary"
					display="flex"
					alignItems="center"
					gap={1}
				>
					<EventBusyIcon /> No upcoming events found.
				</Typography>
			)}

			{/* Upcoming Events Table */}
			{(clubAnalytics?.upcomingEvents?.length || 0) > 0 ? (
				<Card
					sx={{ mt: 5 }}
					elevation={3}
				>
					<CardContent>
						<Typography
							variant="h6"
							gutterBottom
						>
							Upcoming Events
						</Typography>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Title</TableCell>
									<TableCell>Date & Time</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{clubAnalytics?.upcomingEvents?.map((event) => (
									<TableRow key={event?._id}>
										<TableCell>{event?.title || "Untitled Event"}</TableCell>
										<TableCell>
											{event?.eventDateTime
												? new Date(event.eventDateTime).toLocaleString()
												: "N/A"}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			) : (
				<Typography
					variant="body1"
					mt={5}
					color="text.secondary"
					display="flex"
					alignItems="center"
					gap={1}
				>
					<EventBusyIcon /> No upcoming events found.
				</Typography>
			)}

			{/* Participant Counts - Bar Chart */}
			{(clubAnalytics?.participantCounts?.length || 0) >= 5 ? (
				<Card
					sx={{ mt: 5 }}
					elevation={3}
				>
					<CardContent>
						<Typography
							variant="h6"
							gutterBottom
						>
							Participant Count (Last 5 Events)
						</Typography>
						<ResponsiveContainer
							width="100%"
							height={300}
						>
							<BarChart
								data={clubAnalytics?.participantCounts?.slice(-5) || []}
								margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="title" />
								<YAxis allowDecimals={false} />
								<Tooltip />
								<Bar
									dataKey="participantCount"
									fill="#1976d2"
									radius={[6, 6, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			) : (
				<Typography
					variant="body1"
					mt={5}
					color="text.secondary"
					display="flex"
					alignItems="center"
					gap={1}
				>
					<BarChartIcon /> Not enough data to display participant statistics. At
					least 5 events required.
				</Typography>
			)}

			{/* Monthly Trend - Line Chart */}
			{(monthlyTrendData?.length || 0) > 0 ? (
				<Card
					sx={{ mt: 5 }}
					elevation={3}
				>
					<CardContent>
						<Typography
							variant="h6"
							gutterBottom
						>
							Monthly Event Trend
						</Typography>
						<ResponsiveContainer
							width="100%"
							height={300}
						>
							<LineChart
								data={monthlyTrendData}
								margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="month" />
								<YAxis allowDecimals={false} />
								<Tooltip />
								<Line
									type="monotone"
									dataKey="count"
									stroke="#4caf50"
									strokeWidth={3}
									dot={{ r: 5 }}
									activeDot={{ r: 8 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			) : (
				<Typography
					variant="body1"
					mt={5}
					color="text.secondary"
					display="flex"
					alignItems="center"
					gap={1}
				>
					<TimelineIcon /> Monthly trend data not available.
				</Typography>
			)}
		</Box>
	);
};

export default ClubAnalytics;
