import { Route } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";

import CommonRoutes from "./CommonRoutes";
import ClubDashboard from "../components/pages/club/ClubDashboard";
import EventManagement from "../components/pages/club/EventManagement";
const ClubRoutes = () => {
	return (
		<Route
			path="/club"
			element={<Dashboard />}
		>
			{CommonRoutes()}
		</Route>
	);
};

export default ClubRoutes;
