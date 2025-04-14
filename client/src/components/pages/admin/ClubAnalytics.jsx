import React, { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	Button,
	Box,
} from "@mui/material";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	ResponsiveContainer,
} from "recharts";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../routes/apiConfig";

const ClubAnalyticsDashboard = () => {
	const [analyticsData, setAnalyticsData] = useState(null);
	const user = getUser();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				const res = await axios.post("http://localhost:3002/auth/clubs");
				setAnalyticsData(res.data);
			} catch (err) {
				console.error("Failed to fetch analytics", err);
			}
		};
		fetchAnalytics();
	}, []);

	if (!analyticsData) return <Typography>Loading...</Typography>;

	const {
		clubs = [],
		totalMembers = 0,
		eventsWithOrganizer = [],
		eventTypeStats = [],
		monthlyEventTrend = {},
	} = analyticsData;

	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

	const cardStyle = {
		transition: "transform 0.2s ease, box-shadow 0.2s ease",
		"&:hover": {
			transform: "translateY(-5px)",
			boxShadow: "0 4px 20px rgba(0, 136, 254, 0.3)",
		},
	};

	return (
		<Grid
			container
			spacing={3}
			sx={{ padding: 3 }}
		>
			{/* Summary Cards */}
			{[
				{ title: "Total Clubs", value: clubs.length },
				{ title: "Total Members", value: totalMembers || 0 },
				{ title: "Events Hosted", value: eventsWithOrganizer?.length || 0 },
			].map((item, idx) => (
				<Grid
					item
					xs={12}
					md={4}
					key={idx}
				>
					<Card sx={cardStyle}>
						<CardContent>
							<Typography variant="h6">{item.title}</Typography>
							<Typography variant="h4">{item.value}</Typography>
						</CardContent>
					</Card>
				</Grid>
			))}

			{/* Active Clubs Table */}
			<Grid
				item
				xs={12}
			>
				<Card sx={cardStyle}>
					<CardContent>
						<Typography
							variant="h6"
							gutterBottom
						>
							Active Clubs
						</Typography>
						<table width="100%">
							<thead>
								<tr>
									<th align="left">Club Name</th>
									<th align="center">Members</th>
									<th align="center">Events Hosted</th>
									<th align="center">Status</th>
									<th align="center">Actions</th>
								</tr>
							</thead>
							<tbody>
								{clubs.length > 0 ? (
									clubs.map((club) => (
										<tr key={club._id}>
											<td>{club.clubName || "N/A"}</td>
											<td align="center">{club.totalMembers ?? 0}</td>
											<td align="center">{club.eventsHosted ?? 0}</td>
											<td align="center">{club.status || "Inactive"}</td>
											<td align="center">
												<Button
													variant="outlined"
													size="small"
													sx={{
														borderColor: "#0088FE",
														color: "#0088FE",
														"&:hover": {
															backgroundColor: "#e3f2fd",
														},
													}}
													onClick={() =>
														navigate(`/${user.role}/analytics/${club._id}`)
													}
												>
													View Analytics
												</Button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={5}
											align="center"
										>
											No clubs found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</CardContent>
				</Card>
			</Grid>

			{/* Pie Chart */}
			<Grid
				item
				xs={12}
				md={6}
			>
				<Card sx={cardStyle}>
					<CardContent>
						<Typography
							variant="h6"
							gutterBottom
						>
							Event Type Distribution
						</Typography>
						{eventTypeStats.length > 0 ? (
							<ResponsiveContainer
								width="100%"
								height={300}
							>
								<PieChart>
									<Pie
										data={eventTypeStats}
										dataKey="ratio"
										nameKey="eventType"
										cx="50%"
										cy="50%"
										outerRadius={100}
										fill="#8884d8"
										label
									>
										{eventTypeStats.map((_, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						) : (
							<Typography>No event type data available.</Typography>
						)}
					</CardContent>
				</Card>
			</Grid>

			{/* Bar Chart */}
			<Grid
				item
				xs={12}
				md={6}
			>
				<Card sx={cardStyle}>
					<CardContent>
						<Typography
							variant="h6"
							gutterBottom
						>
							Monthly Event Trends
						</Typography>
						{Object.keys(monthlyEventTrend).length > 0 ? (
							<ResponsiveContainer
								width="100%"
								height={300}
							>
								<BarChart
									data={Object.entries(monthlyEventTrend).map(
										([month, count]) => ({ month, count })
									)}
								>
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip />
									<Bar
										dataKey="count"
										fill="#82ca9d"
									/>
								</BarChart>
							</ResponsiveContainer>
						) : (
							<Typography>No trend data available.</Typography>
						)}
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	);
};

export default ClubAnalyticsDashboard;
