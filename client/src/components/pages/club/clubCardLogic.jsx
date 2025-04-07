import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, getToken, getUser } from "../../../routes/apiConfig";
import axios from "axios";
export const useClubCard = (club) => {
	const user = getUser();
	const navigate = useNavigate();
	const [isFollowing, setIsFollowing] = useState(false);
	const [followersCount, setFollowersCount] = useState(
		club?.followers?.length ?? 0
	);

	useEffect(() => {
		if (user && club?.followers?.includes(user._id)) {
			setIsFollowing(true);
		}
	}, [user, club?.followers]);

	const handleViewProfile = () => {
		if (club?._id) {
			navigate(`${club._id}`, { state: { club } });
		}
	};

	const presidents = club?.members?.find(
		(member) => member?.role === "President" && member?.userId
	)
		? {
				id:
					club.members
						.find((m) => m.role === "President" && m.userId)
						?.userId?._id?.toString() || "Unknown",
				name:
					club.members.find((m) => m.role === "President" && m.userId)?.userId
						?.fullName || "Unknown",
		  }
		: { id: "N/A", name: "N/A" };

	const handleFollowClub = async () => {
		try {
			const token = getToken();
			if (!token || !club?._id) return;

			const response = await axios.post(
				`${API_URL}/student/club/${club._id}/follow`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(response.data.message);

			setIsFollowing((prev) => !prev);
			setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1)); // update followers count
		} catch (error) {
			console.error("Error following/unfollowing:", error);
		}
	};

	return {
		isFollowing,
		handleViewProfile,
		handleFollowClub,
		presidents,
		followersCount,
	};
};
