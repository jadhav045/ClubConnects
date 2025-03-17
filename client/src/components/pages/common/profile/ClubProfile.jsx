import React from "react";

const ClubProfile = ({ club }) => {
	if (!club) return <p>No club data available</p>;

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold mb-4">{club.clubName}</h1>
			<p className="text-gray-600 mb-6">{club.description}</p>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Club Info */}
				<div>
					<h2 className="text-xl font-semibold mb-2">Basic Info</h2>
					<p>Short Name: {club.shortName}</p>
					<p>Founded: {club.foundingYear}</p>
					<p>Max Members: {club.maxMembers}</p>
					<p>Membership Fee: ${club.membershipFee}</p>
					<p>Status: {club.status}</p>
				</div>

				{/* Social Media Links */}
				<div>
					<h2 className="text-xl font-semibold mb-2">Social Media</h2>
					{Object.entries(club.socialMedia || {}).map(
						([platform, link]) =>
							link && (
								<p key={platform}>
									<a
										href={link}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-500 hover:underline"
									>
										{platform.charAt(0).toUpperCase() + platform.slice(1)}
									</a>
								</p>
							)
					)}
				</div>
			</div>

			{/* Club Members */}
			<div className="mt-6">
				<h2 className="text-xl font-semibold mb-4">Members</h2>
				<ul>
					{club.members?.map((member, index) => (
						<li
							key={index}
							className="mb-2"
						>
							{member.role}: {member.userId}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default ClubProfile;

// Use the component like this:
// <ClubProfile club={clubData} />

// Let me know if you want any adjustments! 🚀
