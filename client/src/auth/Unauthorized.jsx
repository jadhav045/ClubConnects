import React from "react";

const Unauthorized = () => {
	const { user } = useSelector((store) => store.auth);
	return (
		<div>
			Unauthorized
			<h1>{user.role}</h1>
		</div>
	);
};

export default Unauthorized;
