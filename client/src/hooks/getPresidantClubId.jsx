export const getPresidentClubId = (user) => {
	if (!user || !Array.isArray(user.clubsJoined)) {
		return null; // Return null if user or clubsJoined is undefined
	}

	const presidentClub = user.clubsJoined.find(
		(club) => club.role === "President"
	);
	return presidentClub ? presidentClub.clubId : null;
};
