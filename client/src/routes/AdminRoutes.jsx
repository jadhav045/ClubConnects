import { Route } from "react-router-dom";

import CommonRoutes from "./CommonRoutes";
import Dashboard from "../components/dashboard/Dashboard";
import ManageUser from "../components/pages/admin/ManageUser";
import Reports from "../components/pages/admin/Reports";
import InstitutionManagement from "../components/pages/admin/InstitutionManagement";
import UpdateCollegeProfile from "../components/pages/common/profile/UpdateCollegeProfile";
import ClubAnalytics from "../components/pages/admin/ClubListWithAnalytics";

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
				element={<ManageUser />}
			/>
			<Route
				path="reports"
				element={<Reports />}
			/>
			<Route
				path="colleges/:id/edit"
				element={<UpdateCollegeProfile />}
			/>
			<Route
				path="institute/analytics/:clubId"
				element={<ClubAnalytics />}
			/>
		</Route>
	);
};

export default AdminRoutes;
