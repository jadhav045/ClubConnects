import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
	const { user } = useSelector((store) => store.auth);

	if (!user) {
		return (
			<Navigate
				to="/login"
				replace
			/>
		);
	}

	const role = user.role.toLowerCase(); // Create a copy instead of modifying user

	if (!allowedRoles.includes(role)) {
		return (
			<Navigate
				to="/unauthorized"
				replace
			/>
		);
	}

	return <Outlet />;
};

export default ProtectedRoute;
