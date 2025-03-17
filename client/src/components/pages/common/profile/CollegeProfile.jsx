import React from "react";

const CollegeProfile = ({ college }) => {
	if (!college) return <p>No college data available</p>;

	return (
		<div className="p-6">
			<div className="bg-white shadow-lg rounded-lg p-6">
				<div className="flex items-center gap-4">
					{college.logo && (
						<img
							src={college.logo}
							alt={`${college.name} logo`}
							className="w-24 h-24 object-contain"
						/>
					)}
					<div>
						<h1 className="text-2xl font-bold">{college.name}</h1>
						<p className="text-sm text-gray-600">{college.description}</p>
						<p className="mt-2 text-gray-700">
							{college.universityAffiliation}
						</p>
						<p className="text-gray-700">
							Established: {college.establishedYear}
						</p>
					</div>
				</div>

				<div className="mt-6">
					<h2 className="text-xl font-semibold">Contact Info</h2>
					<p>Phone: {college.contactInfo?.phoneNumber}</p>
					<p>Email: {college.contactInfo?.email}</p>
					<p>Website: {college.contactInfo?.website}</p>
				</div>

				<div className="mt-6">
					<h2 className="text-xl font-semibold">Address</h2>
					<p>{college.address?.street}</p>
					<p>
						{college.address?.city}, {college.address?.state},{" "}
						{college.address?.zipCode}
					</p>
					<p>{college.address?.country}</p>
				</div>

				<div className="mt-6">
					<h2 className="text-xl font-semibold">Campus Infrastructure</h2>
					<p>Campus Area: {college.campusArea} acres</p>
					<p>Hostels Available: {college.hostelsAvailable ? "Yes" : "No"}</p>
					<p>Library Books: {college.libraryDetails?.booksCount}</p>
					<p>
						Digital Access:{" "}
						{college.libraryDetails?.digitalAccess ? "Yes" : "No"}
					</p>
					<p>Labs: {college.labs?.join(", ")}</p>
				</div>

				<div className="mt-6">
					<h2 className="text-xl font-semibold">Performance Metrics</h2>
					<p>Placement Rate: {college.performanceMetrics?.placementRate}%</p>
					<p>
						Research Papers Published:{" "}
						{college.performanceMetrics?.researchPapersPublished}
					</p>
					<p>
						Faculty-Student Ratio:{" "}
						{college.performanceMetrics?.facultyStudentRatio}
					</p>
				</div>

				<div className="mt-6">
					<h2 className="text-xl font-semibold">Social Links</h2>
					<div className="flex gap-4">
						{college.socialLinks?.linkedIn && (
							<a
								href={college.socialLinks.linkedIn}
								className="text-blue-500"
							>
								LinkedIn
							</a>
						)}
						{college.socialLinks?.twitter && (
							<a
								href={college.socialLinks.twitter}
								className="text-blue-400"
							>
								Twitter
							</a>
						)}
						{college.socialLinks?.facebook && (
							<a
								href={college.socialLinks.facebook}
								className="text-blue-700"
							>
								Facebook
							</a>
						)}
						{college.socialLinks?.instagram && (
							<a
								href={college.socialLinks.instagram}
								className="text-pink-500"
							>
								Instagram
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CollegeProfile;

// You can use this component by passing a `college` object as a prop.
// Example:
// <CollegeProfile college={collegeData} />

// Let me know if you’d like any adjustments or features added! 🚀
