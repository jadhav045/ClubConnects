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

	let items = [
		// { name: "Home", href: `/${user.role}/home` }, // Modified here
		{ name: "About Us", href: `/${user.role}/about` }, // Modified here
		{ name: "Events", href: `/${user.role}/events` }, // Modified here
		{ name: "Clubs", href: `/${user.role}/clubs` }, // Modified here
		{ name: "Discussions", href: `/${user.role}/discussions` }, // Modified here
		{ name: "Resources", href: `/${user.role}/resources` }, // Modified here
	];

	// if (user.role === "admin") {
	// 	items.push({ name: "Admin Panel", href: "/admin" }); // Admin panel remains /admin
	// }

	return items;
};

export const getSidebarItems = () => {
	const { user } = useSelector((store) => store.auth);

	if (!user) return [];

	let items = [
		{ name: "Feed", href: `/${user.role}/feed`, icon: "📢" },
		{ name: "Profile", href: `/${user.role}/profile`, icon: "👤" },
		{ name: "Chat", href: `/${user.role}/chat`, icon: "💬" },
		{ name: "Notifications", href: `/${user.role}/notifications`, icon: "🔔" },
	];

	// check here does user is president of some club or not
	// if yes then popuate him the other club options 
	switch (user.role) {
		case "Admin":
			items.push({ name: "Manage Users", href: "/admin/users", icon: "⚙️" });
			items.push({ name: "Reports", href: "/admin/reports", icon: "📊" });
			break;

		case "Faculty":
			items.push({ name: "Manage Clubs", href: "/faculty/clubs", icon: "🏫" });
			items.push({
				name: "Manage Events",
				href: "/faculty/events",
				icon: "📅",
			});
			break;
// here will be change 
		case "Club":
			items.push({
				name: "Club Dashboard",
				href: "/club/dashboard",
				icon: "🎭",
			});
			items.push({
				name: "Event Management",
				href: "/club/events",
				icon: "📆",
			});
			break;

		case "Alumni":
			items.push({
				name: "Alumni Network",
				href: "/alumni/network",
				icon: "🤝",
			});
			items.push({
				name: "Mentorship",
				href: "/alumni/mentorship",
				icon: "🎓",
			});
			break;

		case "Student":
			items.push({
				name: "My Clubs",
				href: "/student/joined/clubs",
				icon: "🏫",
			});
			items.push({
				name: "Opportunities",
				href: "/student/opportunities",
				icon: "🚀",
			});
			items.push({
				name: "Mentor By",
				href: "/student/mentorby",
				icon: "🚀",
			});
			break;
	}

	return items;
};
