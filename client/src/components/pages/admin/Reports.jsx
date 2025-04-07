import React from "react";
import ClubAnalytics from "./ClubAnalytics";
import ClubAnalyticsDashboard from "./ClubAnalytics";
import UpdateCollegeProfile from "../common/profile/UpdateCollegeProfile";
import { useNavigate } from "react-router-dom";

const Reports = () => {
	const navigate = useNavigate();

	const college = {
		_id: "67f0b94e49541ac6e2432033",
	};
	const handleEdit = () => {
		// Navigate to edit route with college ID
		navigate(`/admin/colleges/${college._id}/edit`);
	};

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-2xl font-bold text-center mb-6">Analytics</h1>
			<ClubAnalyticsDashboard />
			{/* <UpdateCollegeProfile /> */}
		</div>
	);
};

export default Reports;
