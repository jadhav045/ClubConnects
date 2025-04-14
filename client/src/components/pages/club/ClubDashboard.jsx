// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Line, Bar } from "react-chartjs-2";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { getPresidentClub, isPresident } from "../../../routes/apiConfig";
// // import { getPresidentClubId } from "../../../hooks/getPresidantClubId";
// // import {isPresident} from "../"
// const localizer = momentLocalizer(moment);

// const ClubDashboard = () => {

// 	const { user } = useSelector((state) => state.auth);
// 	const [activeTab, setActiveTab] = useState("members");
// 	const [clubData, setClubData] = useState(null);
// 	const [financials, setFinancials] = useState({
// 		balance: 0,
// 		duesPaid: 0,
// 		expenses: 0,
// 	});
// 	const clubId = getPresidentClub().clubId;
// 	console.log("club id", clubId);
// 	// Mock data - replace with actual API calls
// 	useEffect(() => {
// 		// Fetch club data
// 		const mockClubData = {
// 			clubName: "Tech Innovators Club",
// 			members: [
// 				{
// 					userId: "1",
// 					name: "John Doe",
// 					role: "President",
// 					joinedDate: "2023-01-15",
// 				},
// 				{
// 					userId: "2",
// 					name: "Jane Smith",
// 					role: "Treasurer",
// 					joinedDate: "2023-02-01",
// 				},
// 				// ... more members
// 			],
// 			events: [
// 				{
// 					title: "Hackathon",
// 					start: new Date(2023, 7, 15),
// 					end: new Date(2023, 7, 17),
// 				},
// 				// ... more events
// 			],
// 			documents: [
// 				{ title: "Club Constitution", uploadedAt: "2023-03-01" },
// 				// ... more documents
// 			],
// 		};
// 		setClubData(mockClubData);
// 	}, []);

// 	if (isPresident()) {
// 		return (
// 			<div className="p-4 text-red-500">
// 				Access Denied - President privileges required
// 			</div>
// 		);
// 	}

// 	if (!clubData) return <div>Loading Dashboard...</div>;

// 	return (
// 		<div className="p-4 bg-gray-50 min-h-screen">
// 			{/* Header */}
// 			<div className="mb-6">
// 				<h1 className="text-3xl font-bold">{clubData.clubName} Dashboard</h1>

// 				<div className="flex gap-2 mt-4">
// 					{["members", "events", "finances", "documents", "analytics"].map(
// 						(tab) => (
// 							<button
// 								key={tab}
// 								onClick={() => setActiveTab(tab)}
// 								className={`px-4 py-2 rounded capitalize ${
// 									activeTab === tab
// 										? "bg-blue-600 text-white"
// 										: "bg-white border"
// 								}`}
// 							>
// 								{tab}
// 							</button>
// 						)
// 					)}
// 				</div>
// 			</div>

// 			{/* Members Tab */}
// 			{activeTab === "members" && (
// 				<div className="bg-white p-4 rounded shadow">
// 					<h2 className="text-xl font-semibold mb-4">Member Management</h2>
// 					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 						<div>
// 							<h3 className="font-medium mb-2">Members List</h3>
// 							<div className="space-y-2">
// 								{clubData.members.map((member) => (
// 									<div
// 										key={member.userId}
// 										className="flex items-center justify-between p-2 border rounded"
// 									>
// 										<div>
// 											<p className="font-medium">{member.name}</p>
// 											<p className="text-sm text-gray-600">{member.role}</p>
// 										</div>
// 										<select
// 											value={member.role}
// 											className="p-1 border rounded"
// 											onChange={(e) =>
// 												console.log("Update role:", e.target.value)
// 											}
// 										>
// 											<option value="President">President</option>
// 											<option value="Treasurer">Treasurer</option>
// 											<option value="Member">Member</option>
// 										</select>
// 									</div>
// 								))}
// 							</div>
// 						</div>
// 						<div>
// 							<h3 className="font-medium mb-2">Quick Actions</h3>
// 							<div className="space-y-2">
// 								<button className="w-full p-2 bg-green-100 rounded hover:bg-green-200">
// 									Send Mass Notification
// 								</button>
// 								<button className="w-full p-2 bg-blue-100 rounded hover:bg-blue-200">
// 									Generate Membership Report
// 								</button>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			)}

// 			{activeTab === "events" && (
// 				<div className="bg-white p-4 rounded shadow">
// 					<h2 className="text-xl font-semibold mb-4">Event Management</h2>
// 					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
// 						<div>
// 							<Calendar
// 								localizer={localizer}
// 								events={clubData.events}
// 								startAccessor="start"
// 								endAccessor="end"
// 								style={{ height: 400 }}
// 							/>
// 						</div>
// 						<div className="space-y-4">
// 							<button className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
// 								Create New Event
// 							</button>
// 							<div className="border rounded p-2">
// 								<h4 className="font-medium mb-2">Upcoming Events</h4>
// 								{clubData.events.map((event) => (
// 									<div
// 										key={event.title}
// 										className="p-2 border-b last:border-0"
// 									>
// 										{event.title} - {moment(event.start).format("MMM Do")}
// 									</div>
// 								))}
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			)}

// 			{activeTab === "finances" && (
// 				<div className="bg-white p-4 rounded shadow">
// 					<h2 className="text-xl font-semibold mb-4">Financial Management</h2>
// 					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
// 						<div className="p-4 bg-green-50 rounded">
// 							<p className="text-gray-600">Total Balance</p>
// 							<p className="text-2xl font-bold">${financials.balance}</p>
// 						</div>
// 						<div className="p-4 bg-blue-50 rounded">
// 							<p className="text-gray-600">Dues Collected</p>
// 							<p className="text-2xl font-bold">${financials.duesPaid}</p>
// 						</div>
// 						<div className="p-4 bg-red-50 rounded">
// 							<p className="text-gray-600">Total Expenses</p>
// 							<p className="text-2xl font-bold">${financials.expenses}</p>
// 						</div>
// 					</div>
// 					<div className="h-64">
// 						<Line
// 							data={{
// 								labels: ["Jan", "Feb", "Mar", "Apr", "May"],
// 								datasets: [
// 									{
// 										label: "Financial Flow",
// 										data: [1200, 1900, 3000, 2500, 2200],
// 										borderColor: "rgb(79, 70, 229)",
// 										tension: 0.1,
// 									},
// 								],
// 							}}
// 						/>
// 					</div>
// 				</div>
// 			)}

// 			{/* Documents Tab */}
// 			{activeTab === "documents" && (
// 				<div className="bg-white p-4 rounded shadow">
// 					<h2 className="text-xl font-semibold mb-4">Document Management</h2>
// 					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 						<div>
// 							<div className="border rounded p-4 mb-4">
// 								<h3 className="font-medium mb-2">Upload New Document</h3>
// 								<input
// 									type="file"
// 									className="mb-2"
// 								/>
// 								<input
// 									type="text"
// 									placeholder="Document Title"
// 									className="w-full p-2 border rounded mb-2"
// 								/>
// 								<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
// 									Upload
// 								</button>
// 							</div>
// 						</div>
// 						<div>
// 							<h3 className="font-medium mb-2">Existing Documents</h3>
// 							<div className="space-y-2">
// 								{clubData.documents.map((doc) => (
// 									<div
// 										key={doc.title}
// 										className="flex items-center justify-between p-2 border rounded"
// 									>
// 										<span>{doc.title}</span>
// 										<button className="text-blue-600 hover:text-blue-800">
// 											Download
// 										</button>
// 									</div>
// 								))}
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			)}

// 			{/* Analytics Tab */}
// 			{activeTab === "analytics" && (
// 				<div className="bg-white p-4 rounded shadow">
// 					<h2 className="text-xl font-semibold mb-4">Club Analytics</h2>
// 					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// 						<div className="p-4 bg-white border rounded">
// 							<h3 className="font-medium mb-2">Member Engagement</h3>
// 							<Bar
// 								data={{
// 									labels: ["Events", "Meetings", "Posts", "Collaborations"],
// 									datasets: [
// 										{
// 											label: "Participation Rate",
// 											data: [65, 59, 80, 81],
// 											backgroundColor: "rgba(79, 70, 229, 0.8)",
// 										},
// 									],
// 								}}
// 							/>
// 						</div>
// 						<div className="p-4 bg-white border rounded">
// 							<h3 className="font-medium mb-2">Growth Metrics</h3>
// 							<Line
// 								data={{
// 									labels: ["Jan", "Feb", "Mar", "Apr", "May"],
// 									datasets: [
// 										{
// 											label: "New Members",
// 											data: [12, 19, 3, 5, 2],
// 											borderColor: "rgb(79, 70, 229)",
// 											tension: 0.1,
// 										},
// 									],
// 								}}
// 							/>
// 						</div>
// 					</div>
// 				</div>
// 			)}
// 		</div>
// 	);
// };

// export default ClubDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Box } from "@mui/material";
// import ClubDashboard from "./ClubDashboard";
// import { getPresidentClub, getToken } from "@/utils/auth"; // adjust paths accordingly
// import { API_URL } from "@/constants";
import { API_URL, getPresidentClub, getToken } from "../../../routes/apiConfig";
import ClubDashboard2 from "./ClubDashboard2";
import Dashboard2 from "./ClubDashboard2";

const ClubDashboardPage = () => {
	const [club, setClub] = useState(null);
	const [loading, setLoading] = useState(true);

	const clubId = getPresidentClub()?.clubId;

	useEffect(() => {
		const fetchClub = async () => {
			try {
				const token = getToken();
				const response = await axios.get(`${API_URL}/student/club/${clubId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setClub(response.data.club);
			} catch (error) {
				console.error("Error fetching club data:", error);
			} finally {
				setLoading(false);
			}
		};

		if (clubId) {
			fetchClub();
		}
	}, [clubId]);

	if (loading || !club) {
		return (
			<Box className="flex justify-center items-center h-screen">
				<CircularProgress />
			</Box>
		);
	}

	return <Dashboard2 club={club} />;
};

export default ClubDashboardPage;
