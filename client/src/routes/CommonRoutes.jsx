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
	prn: "12345678",
	email: "john.doe@example.com",
	password: "hashed_password",
	role: "Student",
	branch: "Computer Science",
	profilePicture: "https://example.com/profile.jpg",
	phoneNumber: "+1234567890",
	gender: "Male",
	dateOfBirth: "2000-01-01",
	socialLinks: {
		linkedIn: "https://linkedin.com/in/johndoe",
		twitter: "https://twitter.com/johndoe",
		github: "https://github.com/johndoe",
		personalWebsite: "https://johndoe.com",
	},
	posts: [],
	saved: [],
	address: {
		street: "123 Main St",
		city: "New York",
		state: "NY",
		zipCode: "10001",
		country: "USA",
	},
	awards: [
		{
			title: "Best Project Award",
			description: "Awarded for the best final-year project",
			date: "2023-05-20",
			image: "https://example.com/award.jpg",
		},
	],

	profileId: "profile12345",
	createdFaculty: [],
	createdCollege: [],
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
			<Route
				path="resources"
				element={<Resources />}
			/>

		</>
	);
};

export default CommonRoutes;
