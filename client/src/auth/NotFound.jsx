import React from "react";
import { useSelector } from "react-redux";

const NotFound = () => {
	const { user } = useSelector((store) => store.auth);
	return (
		<div>
			Not found page
			{user?.fullName}
		</div>
	);
};

export default NotFound;
