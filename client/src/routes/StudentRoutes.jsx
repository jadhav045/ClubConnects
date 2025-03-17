import { Route } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import CommonRoutes from "./CommonRoutes";
import MyClubs from "../components/pages/student/MyClubs";
import Opportunities from "../components/pages/student/Opportunities";
import MentorBy from "../components/pages/student/MentorBy";

import { useSelector } from "react-redux";
import ClubDashboard from "../components/pages/club/ClubDashboard";
import EventManagement from "../components/pages/club/EventManagement";
import ManageEvents from "../components/pages/faculty/ManageEvents";

const StudentRoutes = () => {
	const { user } = useSelector((store) => store.auth);
	const isPresident = user?.profileId?.clubsJoined?.some(
		(club) => club.role === "President"
	);

	return (
		<Route
			path="/student"
			element={<Dashboard />}
		>
			{CommonRoutes()}

			<Route
				path="joined/clubs"
				element={<MyClubs />}
			/>
			<Route
				path="opportunities"
				element={<Opportunities />}
			/>
			<Route
				path="mentorby"
				element={<MentorBy />}
			/>

			{/* Conditionally render president-specific routes */}
			{isPresident && (
				<>
					<Route
						path="manage/club"
						element={<ClubDashboard />}
					/>
					<Route
						path="manage/events"
						// element={<ManageEvents />}
						element={<EventManagement />}
					/>
				</>
			)}
		</Route>
	);
};

export default StudentRoutes;
