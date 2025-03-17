import React from "react";
import { useSelector } from "react-redux";

const Opportunities = () => {
	const { user } = useSelector((store) => store.auth);
	if (!user) return [];
	const presidentClub = user?.profileId?.clubsJoined?.find(
		(club) => club.role === "President"
	);

	const presidentClubId = presidentClub ? presidentClub.clubId : null;

	console.log(presidentClubId);

	return (
		<div>List Of opportunities and applied history also {presidentClubId}</div>
	);
};

export default Opportunities;
