import React from "react";
import { useSelector } from "react-redux";

const Feed = () => {
	const { user } = useSelector((store) => store.auth);
	return (
		<div>
			Here we will take care of the Feed
			{user.prn || " no "}
		</div>
	);
};

export default Feed;
