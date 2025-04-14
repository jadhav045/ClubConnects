import React, { useState } from "react";
import Actions from "./Actions";
import {
	Awards,
	ClubsJoined,
	CreatedClub,
	FacultyExtra,
	FacultyPublications,
	Skills,
	SocialLinks,
} from "./SubComponent";
import { ResponsiveNavigation } from "./ResponsiveNavigation";
import { useNavigate } from "react-router-dom";
import UpdateProfile from "./UpdateProfile";

const StudentAlumniProfile = ({ user }) => {
	const navigate = useNavigate();
	const {
		profileId,
		role,
		fullName,
		prn,
		email,
		phoneNumber,
		gender,
		address,
		socialLinks,
		awards,
	} = user ?? {};

	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
			{/* Header Section */}

			<div className="bg-white p-6 rounded-xl shadow-md space-y-6">
				{/* Header */}
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-bold text-gray-800">Profile</h2>
					<button
						onClick={openModal}
						className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
					>
						Update Profile
					</button>
				</div>

				{/* Profile Info */}
				<div className="flex flex-col sm:flex-row gap-6">
					{/* Profile Image + Role Details */}
					<div className="flex flex-col items-center sm:items-start">
						<img
							src={user?.profilePicture || "https://via.placeholder.com/150"}
							alt="Profile"
							className="w-32 h-32 rounded-full object-cover shadow-md mb-2"
						/>
						<p className="text-sm text-gray-700">
							<strong>Branch:</strong> {profileId?.department || "NA"}
						</p>

						{/* Role-specific info */}
						{role === "Faculty" && (
							<>
								<p className="text-sm text-gray-700">
									<strong>Designation:</strong>{" "}
									{profileId?.designation || "Professor"}
								</p>
								<p className="text-sm text-gray-700">
									<strong>Joined On:</strong>{" "}
									{profileId?.dateOfJoining
										? new Date(profileId.dateOfJoining).toLocaleDateString()
										: "Unknown"}
								</p>
							</>
						)}

						{(role === "Student" || role === "Alumni") && (
							<p className="text-sm text-gray-700">
								<strong>Batch:</strong> {profileId?.enrollmentYear || "2022"} -{" "}
								{profileId?.graduationYear || "2026"}
							</p>
						)}
					</div>

					{/* Basic Info */}
					<div className="flex-1 space-y-2 text-sm sm:text-base">
						<h3 className="text-xl font-semibold text-gray-900">{fullName}</h3>
						<p className="text-gray-700">
							<strong>PRN:</strong> {prn}
						</p>
						<p className="text-gray-700">
							<strong>Email:</strong> {email}
						</p>
						<p className="text-gray-700">
							<strong>Phone:</strong> {phoneNumber}
						</p>
						<p className="text-gray-700">
							<strong>Gender:</strong> {gender}
						</p>
					</div>
				</div>

				{/* Address Section */}
				<div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-700">
					<strong>Address:</strong>{" "}
					{[
						address?.street,
						address?.city,
						address?.state,
						address?.zipCode,
						address?.country,
					]
						.filter(Boolean)
						.join(", ") || "Not provided"}
				</div>
			</div>

			{/* Faculty Specific Sections */}
			{role === "Faculty" && profileId && (
				<>
					<FacultyExtra
						qualifications={profileId?.qualifications}
						researchAreas={profileId?.researchAreas}
						teachingSubjects={profileId?.teachingSubjects}
					/>
					<CreatedClub
						clubs={profileId?.createdClub}
						role={role}
					/>
					<FacultyPublications publications={profileId?.publications} />
				</>
			)}

			{/* Student/Alumni Specific Sections */}
			{(role === "Alumni" || role === "Student") && (
				<ClubsJoined clubsJoined={profileId?.clubsJoined} />
			)}

			{/* Social Links */}
			<SocialLinks socialLinks={socialLinks} />

			{/* Awards & Skills Section */}
			<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-gray-50 p-4 rounded-md shadow-sm">
					<Awards awards={awards} />
				</div>
				{(role === "Alumni" || role === "Student") && (
					<div className="bg-gray-50 p-4 rounded-md shadow-sm">
						<Skills skills={profileId?.skills} />
					</div>
				)}
			</div>

			{/* Responsive Navigation */}
			<ResponsiveNavigation user={user} />

			{/* Modal for updating profile */}
			{isModalOpen && (
				<div className="modal-container fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="modal-content bg-white p-8 rounded-lg">
						<UpdateProfile
							user={user}
							closeModal={closeModal}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default StudentAlumniProfile;
