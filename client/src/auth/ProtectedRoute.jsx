// components/ProtectedRoute.js
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {

	const { user } = useSelector((store) => store.auth);
	if (!user) {
		// User is not authenticated; redirect to login page
		return (
			<Navigate
				to="/login"
				replace
			/>
		);
	}


	if (!allowedRoles.includes(user.role)) {
		// User does not have permission; redirect to unauthorized page
		return (
			<Navigate
				to="/unauthorized"
				replace
			/>
		);
	}

	// User is allowed; render the child routes/components
	return <Outlet />;
};

export default ProtectedRoute;
