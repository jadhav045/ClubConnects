import React from "react";
import ClubProfile from "../profile/ClubProfile";

const club = {
	clubName: "Tech Innovators",
	shortName: "TI",
	motto: "Innovate, Create, Elevate",
	description:
		"A club dedicated to exploring new technologies and fostering innovation among students.",
	logo: "https://example.com/logo.png",
	profilePicture: "https://example.com/profile.png",
	socialMedia: {
		facebook: "https://facebook.com/TechInnovators",
		instagram: "https://instagram.com/TechInnovators",
		linkedin: "https://linkedin.com/company/TechInnovators",
		twitter: "https://twitter.com/TechInnovators",
		website: "https://techinnovators.com",
	},
	members: [
		{
			userId: "user123",
			role: "President",
			joinedDate: "2023-05-10",
		},
		{
			userId: "user456",
			role: "Secretary",
			joinedDate: "2023-06-15",
		},
		{
			userId: "user789",
			role: "Supporter",
			joinedDate: "2023-07-20",
		},
	],
	advisors: ["faculty123", "faculty456"],
	maxMembers: 100,
	membershipFee: 50,
	eligibilityCriteria: "Open to all students with a passion for technology.",
	foundingYear: 2018,
	foundingMembers: ["user001", "user002"],
	pastLeaders: [
		{
			userId: "user003",
			role: "President",
			tenureStart: "2020-01-01",
			tenureEnd: "2021-12-31",
		},
	],
	achievements: [
		{
			title: "Hackathon Champions",
			description: "Won first place in the national hackathon.",
			date: "2022-04-15",
			image: "https://example.com/achievement.png",
		},
	],
	events: ["event123", "event456"],
	collaborations: [
		{
			clubId: "club001",
			eventId: "event789",
			details: "Joint workshop on AI and ML.",
		},
	],
	documents: [
		{
			title: "Club Constitution",
			fileUrl: "https://example.com/constitution.pdf",
			uploadedBy: "user123",
			uploadedAt: "2023-01-15",
		},
	],
	createdBy: "admin123",
	collegeId: "college001",
	status: "Active",
};

const AboutUs = () => {
	return (
		<div>
			This is a About Page
			<ClubProfile club={club} />
		</div>
	);
};

export default AboutUs;
