import { Route } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";

import CommonRoutes from "./CommonRoutes";
import MyClubs from "../components/pages/student/MyClubs";
import Opportunities from "../components/pages/student/Opportunities";
import MentorBy from "../components/pages/student/MentorBy";
const StudentRoutes = () => {
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
		</Route>
	);
};

export default StudentRoutes;
