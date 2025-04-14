import { useState } from "react";

const ClubAchievements = ({ achievements = [] }) => {
	const [showAll, setShowAll] = useState(false);

	const visibleAchievements = showAll ? achievements : achievements.slice(0, 2);

	return (
		<div className="mt-8">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
				<button
					onClick={() => setShowModal(true)}
					className="text-sm text-blue-600 hover:underline"
				>
					Add Achievement
				</button>
			</div>

			{visibleAchievements.length > 0 ? (
				<div className="space-y-4">
					{visibleAchievements.map((ach, index) => (
						<div
							key={index}
							className="flex gap-4 items-start border rounded-md p-4 shadow-sm bg-white"
						>
							{ach.image && (
								<img
									src={ach.image}
									alt={ach.title}
									className="w-16 h-16 object-cover rounded-md border"
								/>
							)}
							<div>
								<p className="text-sm font-semibold text-gray-800">
									{ach.title}
									{ach.date && (
										<span className="ml-2 text-xs text-gray-500 font-normal">
											(
											{new Date(ach.date).toLocaleString("default", {
												month: "short",
												year: "numeric",
											})}
											)
										</span>
									)}
								</p>
								<p className="text-sm text-gray-600">{ach.description}</p>
							</div>
						</div>
					))}
				</div>
			) : (
				<p className="text-sm text-gray-500">No achievements added yet.</p>
			)}

			{/* View All / Show Less Toggle */}
			{achievements.length > 2 && (
				<div className="mt-4 text-right">
					<button
						className="text-sm text-blue-600 hover:underline"
						onClick={() => setShowAll((prev) => !prev)}
					>
						{showAll ? "Show Less" : "View All"}
					</button>
				</div>
			)}
		</div>
	);
};

export default ClubAchievements;
