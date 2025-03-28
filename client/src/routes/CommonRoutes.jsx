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

const user = {};

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
			<Route
				path="/discussions/:id"
				element={<DiscussionDetail />}
			/>
		</>
	);
};

export default CommonRoutes;
