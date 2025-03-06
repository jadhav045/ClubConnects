import { Route } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import CommonRoutes from "./CommonRoutes";
import ManageEvents from "../components/pages/faculty/ManageEvents";
import ManageClubs from "../components/pages/faculty/ManageClubs";

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
				element={<ManageClubs />}
			/>
		</Route>
	);
};

export default FacultyRoutes;
