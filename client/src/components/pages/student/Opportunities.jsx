import React from "react";
import { useSelector } from "react-redux";
import OpportunitiesList from "../opportunity/OpportunitiesList";

const Opportunities = () => {
	const { user } = useSelector((store) => store.auth);
	if (!user) return [];
	const presidentClub = user?.profileId?.clubsJoined?.find(
		(club) => club.role === "President"
	);

	const presidentClubId = presidentClub ? presidentClub.clubId : null;

	return (
		<div>
			List Of opportunities and applied history also {user.fullName}
			<OpportunitiesList />
		</div>
	);
};

export default Opportunities;
