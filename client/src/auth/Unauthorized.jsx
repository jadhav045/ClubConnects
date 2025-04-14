import React from "react";
import { useSelector } from "react-redux";

const Unauthorized = () => {
	const { user } = useSelector((store) => store.auth);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
			<h1 className="text-3xl font-bold text-red-600">Unauthorized Access</h1>
			<p className="text-gray-700 mt-2">
				You do not have permission to view this page.
			</p>
			{user && <h2 className="text-lg font-medium mt-4">Role: {user.role}</h2>}
		</div>
	);
};

export default Unauthorized;
