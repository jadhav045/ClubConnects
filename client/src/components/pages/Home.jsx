import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
	const { auth } = useSelector((store) => store.auth);
	return (
		<div>
			Here we will take care of the Home
			{auth}
		</div>
	);
};

export default Home;