import React from "react";
import {
	Globe,
	Briefcase,
	Users,
	Calendar,
	Star,
	GraduationCap,
	Activity,
} from "lucide-react";

const StudentAlumniProfile = ({ user }) => {
	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Profile Details</h2>
			<div className="space-y-6">
				{/* Common Fields */}
				<div>
					<h3 className="text-xl font-semibold">Common Details</h3>
					<p>
						<GraduationCap
							size={16}
							className="inline mr-2"
						/>{" "}
						Department: {user.department}
					</p>
					<p>
						<Calendar
							size={16}
							className="inline mr-2"
						/>{" "}
						Enrollment Year: {user.enrollmentYear}
					</p>
					<p>
						<Calendar
							size={16}
							className="inline mr-2"
						/>{" "}
						Graduation Year: {user.graduationYear}
					</p>
					<p>
						<Star
							size={16}
							className="inline mr-2"
						/>{" "}
						CGPA: {user.cgpa}
					</p>
					<p>
						<Activity
							size={16}
							className="inline mr-2"
						/>{" "}
						Skills: {user.skills.join(", ")}
					</p>
				</div>

				{/* Clubs Joined */}
				<div>
					<h3 className="text-xl font-semibold">Clubs & Roles</h3>
					{user.clubsJoined.map((club, index) => (
						<div
							key={index}
							className="border p-3 rounded mb-2"
						>
							<p>
								<Users
									size={16}
									className="inline mr-2"
								/>{" "}
								Club Role: {club.role}
							</p>
							<p>Joined on: {new Date(club.joinedDate).toLocaleDateString()}</p>
						</div>
					))}
				</div>

				{/* Role-Specific Fields */}
				{user.role === "student" && (
					<div>
						<h3 className="text-xl font-semibold">Internships & Mentors</h3>
						{user.internships.map((internship, index) => (
							<div
								key={index}
								className="border p-3 rounded mb-2"
							>
								<p>
									<Briefcase
										size={16}
										className="inline mr-2"
									/>{" "}
									{internship.title} at {internship.company}
								</p>
								<p>
									Duration: {internship.duration}{" "}
									{internship.isCurrent ? "(Current)" : ""}
								</p>
							</div>
						))}
						<p>Mentors: {user.mentors.length}</p>
					</div>
				)}

				{user.role === "alumni" && (
					<div>
						<h3 className="text-xl font-semibold">Jobs & Mentees</h3>
						{user.jobs.map((job, index) => (
							<div
								key={index}
								className="border p-3 rounded mb-2"
							>
								<p>
									<Briefcase
										size={16}
										className="inline mr-2"
									/>{" "}
									{job.title} at {job.company}
								</p>
								<p>
									Duration: {job.duration} {job.isCurrent ? "(Current)" : ""}
								</p>
							</div>
						))}
						<p>Mentees: {user.mentees.length}</p>
						<p>Events Hosted: {user.eventsHosted.length}</p>
						<p>Opportunities Shared: {user.opportunities.length}</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default StudentAlumniProfile;

// Let me know if you want any adjustments or extra features! 🚀
