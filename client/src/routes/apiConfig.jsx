import { useMemo } from "react";
import { useSelector } from "react-redux";

export const API_URL = "http://localhost:3002";

export const getToken = () => {
	const token = localStorage.getItem("token");
	if (!token) throw new Error("No token found");
	return token;
};

export const getUser = () => {
	const { user } = useSelector((store) => store.auth);
	return user;
};

export const getRole = () => {
	const { user } = useSelector((store) => store.auth);
	return user.role;
};

export const isPresident = () => {
	const user = getUser();
	const isPres = user?.profileId?.clubsJoinded?.some(
		(club) => club.role === "President"
	);

	return isPres;
};

export const getPresidentClub = () => {
	const user = useSelector((state) => state.auth.user); // ✅ Redux state

	const presidentClub = useMemo(() => {
		if (!user?.profileId?.clubsJoined)
			return { isPresident: false, clubId: null };

		const foundClub = user.profileId.clubsJoined.find(
			(club) => club.role === "President"
		);

		return foundClub
			? { isPresident: true, clubId: foundClub.clubId }
			: { isPresident: false, clubId: null };
	}, [user]);

	return presidentClub;
};
