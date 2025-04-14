import React from "react";
import { useSelector } from "react-redux";

const NotFound = () => {
	const { user } = useSelector((store) => store.auth);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
			<h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
			<p className="text-gray-600 mt-2">
				Sorry, the page you are looking for does not exist.
			</p>
			{user?.fullName && (
				<h2 className="text-lg font-medium mt-4">
					Logged in as: <span className="text-blue-600">{user.fullName}</span>
				</h2>
			)}
		</div>
	);
};

export default NotFound;
