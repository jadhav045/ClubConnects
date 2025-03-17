import React from "react";

const FacultyProfile = ({ faculty }) => {
	if (!faculty) return <div>Loading...</div>;

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
			<h1 className="text-2xl font-bold mb-4">{faculty.userId.name}</h1>
			<p className="text-gray-600">
				{faculty.designation} - {faculty.department}
			</p>
			<p className="text-gray-500">Sub Role: {faculty.subRole}</p>
			<p className="text-gray-500">
				Date of Joining: {new Date(faculty.dateOfJoining).toLocaleDateString()}
			</p>

			<h2 className="text-xl font-semibold mt-6">Qualifications</h2>
			<ul className="list-disc list-inside">
				{faculty.qualifications.map((qual, index) => (
					<li key={index}>{qual}</li>
				))}
			</ul>

			<h2 className="text-xl font-semibold mt-6">Research Areas</h2>
			<ul className="list-disc list-inside">
				{faculty.researchAreas.map((area, index) => (
					<li key={index}>{area}</li>
				))}
			</ul>

			<h2 className="text-xl font-semibold mt-6">Teaching Subjects</h2>
			<ul className="list-disc list-inside">
				{faculty.teachingSubjects.map((subject, index) => (
					<li key={index}>{subject}</li>
				))}
			</ul>

			<h2 className="text-xl font-semibold mt-6">Clubs Created</h2>
			<ul className="list-disc list-inside">
				{faculty.createaClub.map((club, index) => (
					<li key={index}>{club.name}</li>
				))}
			</ul>

			<h2 className="text-xl font-semibold mt-6">Publications</h2>
			{faculty.publications.length > 0 ? (
				faculty.publications.map((pub, index) => (
					<div
						key={index}
						className="mt-4"
					>
						<p className="font-semibold">{pub.title}</p>
						<p className="text-gray-500">
							{pub.journal} - {new Date(pub.date).toLocaleDateString()}
						</p>
						{pub.url && (
							<a
								href={pub.url}
								className="text-blue-500 hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								View Publication
							</a>
						)}
					</div>
				))
			) : (
				<p>No publications yet.</p>
			)}

			<h2 className="text-xl font-semibold mt-6">Skills</h2>
			<ul className="flex flex-wrap gap-2">
				{faculty.skills.map((skill, index) => (
					<li
						key={index}
						className="bg-gray-200 px-3 py-1 rounded-full"
					>
						{skill}
					</li>
				))}
			</ul>

			<h2 className="text-xl font-semibold mt-6">Announcements</h2>
			<ul className="list-disc list-inside">
				{faculty.announcements.map((announcement, index) => (
					<li key={index}>{announcement.title}</li>
				))}
			</ul>

			<p className="text-gray-400 text-sm mt-6">
				College ID: {faculty.college.name} | Profile created on:{" "}
				{new Date(faculty.createdAt).toLocaleDateString()}
			</p>
		</div>
	);
};

export default FacultyProfile;

// You can pass faculty data as a prop to this component
// Example usage:
// <FacultyProfile faculty={facultyData} />

// Want me to add a form to edit faculty details or handle different states? Let me know! 🚀
