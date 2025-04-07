import React from "react";
import { useClubCard } from "./ClubCardLogic";
import { useNavigate } from "react-router-dom";
import { getRole, getUser } from "../../../routes/apiConfig";

const ClubCard = ({ club }) => {
	const {
		isFollowing,
		handleViewProfile,
		handleFollowClub,
		presidents,
		followersCount,
	} = useClubCard(club);
	console.log("CLub", club);

	const navigate = useNavigate();
	const role = getRole();
	console.log("Presid", presidents);
	const handleProfile = (id) => {
		navigate(`/${role}/profile/${id}`);
	};
	return (
		<div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6 max-w-lg mx-auto">
			{/* Club Header */}
			<div className="flex justify-between items-center mb-4">
				<img
					src={club?.logo}
					alt="Club Logo"
					className="h-12 w-12 rounded-full object-cover border border-gray-300 shadow-sm"
				/>
				<p className="italic font-medium text-sm text-gray-700 text-right">
					"{club?.motto}"
				</p>
			</div>

			{/* Club Name */}
			<h2 className="text-xl font-bold italic text-gray-900 text-center mb-3">
				{club?.clubName}
			</h2>

			{/* Description */}
			<div className="bg-gray-100 p-4 rounded-md">
				<p className="font-medium text-gray-800 text-sm">{club?.description}</p>
			</div>

			{/* Club Info */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-700 text-center md:text-left">
				{/* Left - Active Members */}
				<div className="md:text-left">
					<p className="font-semibold">Active Members:</p>
					<p className="text-blue-700 font-medium">
						{club?.members?.length ?? 0}+
					</p>
				</div>

				{/* Center - President */}
				<div
					className="md:text-center cursor-pointer "
					onClick={() => handleProfile(presidents.id)}
				>
					<p className="font-semibold">President:</p>
					<p className="text-blue-700 font-medium">
						{presidents.name || "N/A"}
					</p>
				</div>

				{/* Right - Followers */}
				<div className="md:text-right">
					<p className="font-semibold">Followers:</p>
					<p className="text-blue-700 font-medium">{followersCount}+</p>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex justify-between items-center mt-6">
				<button
					onClick={handleFollowClub}
					className={`border px-4 py-2 rounded-md font-semibold text-sm transition ${
						isFollowing
							? "bg-red-600 text-white border-red-600"
							: "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
					}`}
				>
					{isFollowing ? "Unfollow" : "Join"}
				</button>
				<button
					className="border border-blue-600 px-4 py-2 rounded-md text-blue-600 font-semibold text-sm hover:bg-blue-600 hover:text-white transition"
					onClick={handleViewProfile}
				>
					View Profile
				</button>
			</div>
		</div>
	);
};

export default ClubCard;
