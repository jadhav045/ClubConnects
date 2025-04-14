import { Route } from "react-router-dom";
import Dashboard from "../components/dashboard/Dashboard";
import CommonRoutes from "./CommonRoutes";
import ManageEvents from "../components/pages/faculty/ManageEvents";

import ClubManagement from "../components/pages/faculty/ClubManagement";
import ClubAnalytics from "../components/pages/admin/ClubListWithAnalytics";
import ClubAnalyticsDashboard from "../components/pages/admin/ClubAnalytics";
import Reports from "../components/pages/admin/Reports";
import ClubProfile from "../components/pages/common/profile/ClubProfile";
import CollegeProfilePage from "../components/pages/common/profile/CollegeProfilePage";
import UpdateCollegeProfile from "../components/pages/common/profile/UpdateCollegeProfile";

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
			<Route
				path="institute/analytics/:clubId"
				element={<ClubAnalytics />}
			/>
			<Route
				path="reports"
				element={<Reports />}
			/>
			<Route
				path="institute"
				element={<CollegeProfilePage />}
			/>
			<Route
				path="colleges/:id/edit"
				element={<UpdateCollegeProfile />}
			/>
			F
		</Route>
	);
};

export default FacultyRoutes;
