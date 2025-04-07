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
import DiscussionDetails from "../components/pages/discuss/DiscussionDetails";
import CreateOpportunity from "../components/pages/opportunity/CreateOpportunity";
// import ClubProfile from "../components/pages/common/profile/ClubProfile";
import ProfileWrapper from "../components/pages/common/profile/ProfileWrapper";
import { useSelector } from "react-redux";

import PostDetails from "../components/post/PostDetails";
import ClubAnalyticsDashboard from "../components/pages/admin/ClubAnalytics";
import ClubAnalytics from "../components/pages/admin/ClubListWithAnalytics";
import CollegeProfilePage from "../components/pages/common/profile/CollegeProfilePage";
import { UpdateClubProfile } from "../components/pages/common/profile/ClubUpdateProfile";
import ClubProfile from "../components/pages/common/profile/ClubProfile";
// import ClubProfile from "../components/pages/common/profile/ClubProfileCard";

const CommonRoutes = () => {
	const { user } = useSelector((state) => state.auth);

	const routes = [
		{ path: "", element: <Home />, index: true },
		{ path: "feed", element: <Feed /> },
		{ path: "profile", element: <Profile user={user} /> },
		{ path: "chat", element: <Chat /> },
		{ path: "notifications", element: <Notifications /> },
		{ path: "about", element: <AboutUs /> },
		{ path: "events", element: <Events /> },
		{ path: "clubs", element: <Clubs /> },
		{ path: "discussions", element: <Discussion /> },
		{ path: "resources", element: <Resources /> },
		{ path: "discussions/:id", element: <DiscussionDetails /> },
		{ path: "opportunities/create", element: <CreateOpportunity /> },
		{ path: "clubs/:id", element: <ClubProfile /> },
		{ path: "profile/:userId", element: <ProfileWrapper /> },
		{ path: "post/:postId", element: <PostDetails /> },
		// { path: "profile-update/:userId/edit", element: <UpdateProfile /> },
		{ path: "profile-update/:userId", element: <ProfileWrapper /> },
		//  <Route path="/analytics/:clubId" element={<ClubAnalytics />} />
		{ path: "analytics/:clubId", element: <ClubAnalytics /> },
		{ path: "institute/:collegeId", element: <CollegeProfilePage /> },
	];

	return (
		<>
			{routes.map(({ path, element, index }) => (
				<Route
					key={path}
					path={path}
					element={element}
					index={index}
				/>
			))}
		</>
	);
};

export default CommonRoutes;
