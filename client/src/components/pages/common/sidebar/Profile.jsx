import React from "react";
import {
	Mail,
	Phone,
	Calendar,
	MapPin,
	Award,
	Globe,
	FileText,
} from "lucide-react";
import StudentAlumniProfile from "../profile/StudentAlumniProfile";
import FacultyProfile from "../profile/FacultyProfile";

const roleData = {
	department: "Computer Science",
	designation: "Associate Professor",
	dateOfJoining: "2015-08-21",
	qualifications: ["PhD in Machine Learning", "MSc in Computer Science"],
	researchAreas: ["Artificial Intelligence", "Data Science", "Cybersecurity"],
	teachingSubjects: ["Algorithms", "Database Systems", "Cloud Computing"],
	createaClub: [
		{
			_id: "64a8f1c2f8e4c9b2a0c1e4b5",
			name: "AI Innovators Club",
		},
		{
			_id: "64a8f1c2f8e4c9b2a0c1e4b6",
			name: "Cybersecurity Society",
		},
	],
	publications: [
		{
			title: "Deep Learning for Image Recognition",
			journal: "Journal of AI Research",
			date: "2020-05-15",
			url: "https://example.com/publication1",
		},
		{
			title: "Blockchain in Higher Education",
			journal: "IEEE Transactions on Education",
			date: "2019-09-10",
			url: "https://example.com/publication2",
		},
	],
	skills: ["Python", "TensorFlow", "MongoDB", "React"],
	announcements: [
		{
			_id: "64a8f1c2f8e4c9b2a0c1e4b7",
			title: "Upcoming Hackathon Event",
		},
		{
			_id: "64a8f1c2f8e4c9b2a0c1e4b8",
			title: "Guest Lecture on Quantum Computing",
		},
	],
	userId: "64a8f1c2f8e4c9b2a0c1e4b9",
	college: "64a8f1c2f8e4c9b2a0c1e4c0",
	subRole: "Head of Department",
	createdAt: "2023-01-01T10:00:00Z",
	updatedAt: "2023-01-15T15:30:00Z",
};

const Profile = ({ user }) => {
	return (
		<div className="p-6">
			{/* Personal Details */}
			<div className="mb-6">
				<h2 className="text-2xl font-bold mb-4">Personal Details</h2>
				<div className="flex items-center gap-6">
					<img
						src={user.profilePicture}
						alt={user.fullName}
						className="w-32 h-32 rounded-full border"
					/>
					<div>
						<h3 className="text-xl font-semibold">{user.fullName}</h3>
						<p className="flex items-center gap-2">
							<Mail size={16} /> {user.email}
						</p>
						<p className="flex items-center gap-2">
							<FileText size={16} /> PRN: {user.prn}
						</p>
						<p className="flex items-center gap-2">
							<Phone size={16} /> {user.phoneNumber}
						</p>
						<p className="flex items-center gap-2">
							<Calendar size={16} /> {user.dateOfBirth}
						</p>
						<p>Gender: {user.gender}</p>
						<p>Branch: {user.branch}</p>
						<p className="flex items-center gap-2">
							<MapPin size={16} /> {user.address.street}, {user.address.city},{" "}
							{user.address.state}, {user.address.zipCode},{" "}
							{user.address.country}
						</p>
					</div>
				</div>
			</div>

			{/* Posts & Saved Posts */}
			<div className="mb-6">
				<h2 className="text-2xl font-bold mb-4">Posts & Saved Posts</h2>
				<p>Total Posts: {user.posts.length}</p>
				<p>Saved Posts: {user.saved.length}</p>
			</div>

			{/* Awards */}
			<div className="mb-6">
				<h2 className="text-2xl font-bold mb-4">Awards</h2>
				{user.awards.length > 0 ? (
					user.awards.map((award, index) => (
						<div
							key={index}
							className="mb-4"
						>
							<h3 className="text-lg font-semibold flex items-center gap-2">
								<Award size={16} /> {award.title}
							</h3>
							<p>{award.description}</p>
							<small className="text-gray-500">Date: {award.date}</small>
							<hr className="my-4" />
						</div>
					))
				) : (
					<p>No awards yet</p>
				)}
			</div>

			{/* Social Links */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Social Links</h2>
				<p>
					<a
						href={user.socialLinks.linkedIn}
						target="_blank"
						className="text-blue-500"
					>
						LinkedIn
					</a>
				</p>
				<p>
					<a
						href={user.socialLinks.twitter}
						target="_blank"
						className="text-blue-500"
					>
						Twitter
					</a>
				</p>
				<p>
					<a
						href={user.socialLinks.github}
						target="_blank"
						className="text-blue-500"
					>
						GitHub
					</a>
				</p>
				<p>
					<a
						href={user.socialLinks.personalWebsite}
						target="_blank"
						className="text-blue-500 flex items-center gap-2"
					>
						<Globe size={16} /> Personal Website
					</a>
				</p>
			</div>
			<FacultyProfile faculty={roleData} />
		</div>
	);
};

export default Profile;

// Let me know if you want me to tweak anything else! 🚀
