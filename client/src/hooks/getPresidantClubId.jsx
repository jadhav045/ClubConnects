export const getPresidentClubId = (user) => {
	// console.log(user);
	if (!user || !Array.isArray(user?.profileId?.clubsJoined)) {
		return null; // Return null if user or clubsJoined is undefined
	}

	const presidentClub = user?.profileId?.clubsJoined.find(
		(club) => club.role === "President"
	);
	// console.log(presidentClub);
	return presidentClub ? presidentClub.clubId : null;
};
