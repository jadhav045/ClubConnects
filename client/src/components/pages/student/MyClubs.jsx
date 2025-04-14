import React from "react";
import { getUser } from "../../../routes/apiConfig";
const MyClubs = () => {
	const user = getUser();

	return (
		<div>
			<div className="mt-4">
				<h3 className="text-lg font-semibold text-gray-700">Clubs Joined</h3>
				{user?.profileId?.clubsJoined?.length > 0 ? (
					<ul className="list-disc list-inside text-gray-600">
						{user?.profileId?.clubsJoined?.map((club, index) => (
							<li key={index}>
								Role: {club?.role}, Joined on:{" "}
								{club?.joinedDate
									? new Date(club?.joinedDate).toLocaleDateString()
									: "N/A"}
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-500">No clubs joined yet.</p>
				)}
			</div>
		</div>
	);
};

export default MyClubs;
