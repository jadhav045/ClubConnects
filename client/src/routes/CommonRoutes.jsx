import { Route } from "react-router-dom";
import Home from "../components/pages/Home";
import Profile from "../components/pages/common/sidebar/Profile";
import Chat from "../components/pages/common/sidebar/Chat";
import Notifications from "../components/pages/common/sidebar/Notifications";
import Feed from "../components/pages/common/sidebar/Feed";
import AboutUs from "../components/pages/common/navbar/AboutUs";
import Events from "../components/pages/common/navbar/Events";
import Clubs from "../components/pages/common/navbar/Clubs";
import Discussion from "../components/pages/common/navbar/Discussion";
import Resources from "../components/pages/common/navbar/Resources";

const user = {
	fullName: "John Doe",
	prn: "12345",
	email: "john.doe@example.com",
	password: "hashed_password",
	role: "Student",
	branch: "Computer Science",
	profilePicture: "https://example.com/profile.jpg",
	phoneNumber: "123-456-7890",
	gender: "Male",
	dateOfBirth: "2000-05-15T00:00:00Z",
	socialLinks: {
		linkedIn: "https://linkedin.com/in/johndoe",
		twitter: "https://twitter.com/johndoe",
		github: "https://github.com/johndoe",
		personalWebsite: "https://johndoe.dev",
	},
	posts: [],
	saved: [],
	address: {
		street: "123 Main St",
		city: "Metropolis",
		state: "NY",
		zipCode: "10001",
		country: "USA",
	},
	awards: [
		{
			title: "Hackathon Winner",
			description: "Won 1st place in a national hackathon.",
			date: "2023-09-20T00:00:00Z",
			image: "https://example.com/award.jpg",
		},
	],
	socketId: "abc123socket",
	notifications: [
		{
			message: "New event: Tech Meetup",
			isRead: false,
			type: "event",
			referenceId: "65d12345abcd6789ef012345",
			sender: "65d67890abcd1234ef567890",
			url: "https://example.com/event/tech-meetup",
		},
	],
	profileId: {
		userId: "65d12345abcd6789ef012345",
		role: "Student",
		graduationYear: 2024,
		cgpa: 8.7,
		skills: ["JavaScript", "React", "Node.js"],
		eventParticipated: ["65dabc123456ef7890123456"],
		clubsJoined: [
			{
				clubId: "65d67890abcd1234ef567891",
				role: "President",
				joinedDate: "2022-01-10T00:00:00Z",
			},
		],
		department: "Computer Science",
		enrollmentYear: 2020,
		internships: [
			{
				title: "Software Developer Intern",
				company: "TechCorp",
				location: "Remote",
				duration: "3 months",
				isCurrent: false,
			},
		],
		mentors: ["65dabcd123456ef789012347"],
	},
	createdFaculty: [],
	createdCollege: [],
	createdAt: "2024-03-06T00:00:00Z",
	updatedAt: "2024-03-06T00:00:00Z",
};
const CommonRoutes = () => {
	return (
		<>
			<Route
				index
				element={<Home />}
			/>

			<Route
				path="feed"
				element={<Feed />}
			/>
			<Route
				path="profile"
				element={<Profile user={user} />}
			/>
			<Route
				path="chat"
				element={<Chat />}
			/>
			<Route
				path="notifications"
				element={<Notifications />}
			/>
			<Route
				path="about"
				element={<AboutUs />}
			/>
			<Route
				path="events"
				element={<Events />}
			/>
			<Route
				path="clubs"
				element={<Clubs />}
			/>
			<Route
				path="discussions"
				element={<Discussion />}
			/>
		</>
	);
};

export default CommonRoutes;
