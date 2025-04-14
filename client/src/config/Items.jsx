import { useSelector } from "react-redux";

export const getNavbarItems = () => {
	const { user } = useSelector((store) => store.auth);

	if (!user) {
		return [
			{ name: "Home", href: "/home" },
			{ name: "About Us", href: "/about" },
			{ name: "Login", href: "/login" },
			{ name: "Register", href: "/register" },
		];
	}

	const role = user.role.toLowerCase();
	return [
		{ name: "About Us", href: `/${role}/about` },
		{ name: "Events", href: `/${role}/events` },
		{ name: "Clubs", href: `/${role}/clubs` },
		{ name: "Discussions", href: `/${role}/discussions` },
		// { name: "Resources", href: `/${role}/resources` },
	];
};

export const getSidebarItems = () => {
	const { user } = useSelector((store) => store.auth);
	if (!user) return [];

	const role = user.role.toLowerCase();
	const isPresident = user?.profileId?.clubsJoined?.some(
		(club) => club.role === "President"
	);

	const commonItems = [
		{ name: "Feed", href: `/${role}/feed`, icon: "📢" },
		{ name: "Profile", href: `/${role}/profile/${user._id}`, icon: "👤" },
		{ name: "Chat", href: `/${role}/chat`, icon: "💬" },
		// { name: "Notifications", href: `/${role}/notifications`, icon: "🔔" },
	];

	const roleBasedItems = {
		admin: [
			{ name: "Manage Users", href: "/admin/users", icon: "⚙️" },
			{ name: "Reports", href: "/admin/reports", icon: "📊" },
			{ name: "Institute Management", href: "/admin/institute", icon: "🏫" },
		],
		faculty: [
			{ name: "Club Management", href: "/faculty/manage/clubs", icon: "🏫" },
			// { name: "Manage Events", href: "/faculty/manage/events", icon: "📅" },
			{ name: "Reports", href: "/faculty/reports", icon: "📊" },
			{ name: "Instittue", href: "/faculty/institute", icon: "📘" },
		],
		alumni: [
			{ name: "Alumni Network", href: "/alumni/network", icon: "🤝" },
			{ name: "Mentorship", href: "/alumni/mentorship", icon: "🎓" },
			{ name: "Opportunities", href: "/alumni/opportunities", icon: "🚀" },
		],
		student: [
			{ name: "My Clubs", href: "/student/joined/clubs", icon: "🏫" },
			{ name: "Opportunities", href: "/student/opportunities", icon: "🚀" },
			{ name: "Mentor By", href: "/student/mentorby", icon: "📘" },
			...(isPresident
				? [
						{
							name: "Club Dashboard",
							href: "/student/manage/club",
							icon: "🎭",
						},
						{
							name: "Event Management",
							href: "/student/manage/events",
							icon: "📆",
						},
				  ]
				: []),
		],
	};

	return [...commonItems, ...(roleBasedItems[role] || [])];
};
