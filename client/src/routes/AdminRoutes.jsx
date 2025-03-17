import { Route } from "react-router-dom";

import CommonRoutes from "./CommonRoutes";
import Dashboard from "../components/dashboard/Dashboard";
import MangageUser from "../components/pages/admin/MangageUser";
import Reports from "../components/pages/admin/Reports";
import InstitutionManagement from "../components/pages/admin/InstitutionManagement";

// import CommonRoutes from "./CommonRoutes"; // Import the common routes

const AdminRoutes = () => {
	return (
		<Route
			path="/admin"
			element={<Dashboard />}
		>
			{CommonRoutes()}

			<Route
				path="institute"
				element={<InstitutionManagement />}
			/>
			<Route
				path="users"
				element={<MangageUser />}
			/>
			<Route
				path="reports"
				element={<Reports />}
			/>
		</Route>
	);
};

export default AdminRoutes;
