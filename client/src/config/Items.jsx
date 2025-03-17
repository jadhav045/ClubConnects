import { useSelector } from "react-redux";

export const getNavbarItems = () => {
	const { user } = useSelector((store) => store.auth);
	const role = user.role.toLowerCase();

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
		{ name: "About Us", href: `/${role}/about` }, // Modified here
		{ name: "Events", href: `/${role}/events` }, // Modified here
		{ name: "Clubs", href: `/${role}/clubs` }, // Modified here
		{ name: "Discussions", href: `/${role}/discussions` }, // Modified here
		{ name: "Resources", href: `/${role}/resources` }, // Modified here
	];

	// if (user.role === "admin") {
	// 	items.push({ name: "Admin Panel", href: "/admin" }); // Admin panel remains /admin
	// }

	return items;
};
export const getSidebarItems = () => {
	const { user } = useSelector((store) => store.auth);

	if (!user) return [];
	const isPresidant = user?.profileId?.clubsJoined?.some(
		(club) => club.role === "President"
	);
	console.log(isPresidant);
	const role = user.role.toLowerCase();

	let items = [
		{ name: "Feed", href: `/${role}/feed`, icon: "📢" },
		{ name: "Profile", href: `/${role}/profile`, icon: "👤" },
		{ name: "Chat", href: `/${role}/chat`, icon: "💬" },
		{ name: "Notifications", href: `/${role}/notifications`, icon: "🔔" },
	];

	switch (role) {
		case "admin":
			items.push({ name: "Manage Users", href: "/admin/users", icon: "⚙️" });
			items.push({ name: "Reports", href: "/admin/reports", icon: "📊" });
			items.push({
				name: "Institute Management",
				href: "/admin/institute",
				icon: "📊",
			});
			break;

		case "faculty":
			items.push({
				name: "Club Management",
				href: "/faculty/manage/clubs",
				icon: "🏫",
			});
			items.push({
				name: "Manage Events",
				href: "/faculty/manage/events",
				icon: "📅",
			});
			break;

		case "alumni":
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

		case "student":
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
			items.push({ name: "Mentor By", href: "/student/mentorby", icon: "🚀" });

			if (isPresidant) {
				items.push({
					name: "Club Dashboard",
					href: "/student/manage/club",
					icon: "🎭",
				});
				items.push({
					name: "Event Management",
					href: "/student/manage/events",
					icon: "📆",
				});

			}
			break;
	}

	return items;
};
