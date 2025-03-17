import { Route } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import CommonRoutes from "./CommonRoutes";
import ManageEvents from "../components/pages/faculty/ManageEvents";

import ClubManagement from "../components/pages/faculty/ClubManagement";

const FacultyRoutes = () => {
	return (
		<Route
			path="/faculty"
			element={<Dashboard />}
		>
			{CommonRoutes()}

			<Route
				path="manage/events"
				element={<ManageEvents />}
			/>
			<Route
				path="manage/clubs"
				element={<ClubManagement />}
			/>
		</Route>
	);
};

export default FacultyRoutes;
