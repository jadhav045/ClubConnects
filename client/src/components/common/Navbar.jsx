import React from "react";
import { Link } from "react-router-dom";
import { getNavbarItems } from "../../config/Items";
import Logout from "../../auth/LogOut";
import { useMediaQuery } from "@mui/material";
import NotificationBell from "../pages/common/sidebar/NotificationBell";

const Navbar = ({ user }) => {
	const navbarItems = getNavbarItems(user);
	const isSmallScreen = useMediaQuery("(max-width: 768px)");

	return (
		<nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center w-full">
			{/* Logo or Brand Name (optional) */}
			{/* {!isSmallScreen && (
				<div className="text-xl font-bold text-white">
					<Link to="/">Brand</Link>
				</div>
			)} */}

			{/* Left side: Navbar Items */}
			<div className="flex space-x-6">
				{navbarItems.map((item, index) => (
					<div
						key={index}
						className="relative group"
					>
						<Link
							to={item.href}
							className="px-4 py-2 hover:bg-gray-700 rounded-md transition duration-300"
						>
							{item.name}
						</Link>
					</div>
				))}
			</div>
			{/* Right side: Logout Button */}
			<NotificationBell />
			<div className="flex items-center space-x-4 ml-auto mr-30">
				<Logout />
			</div>
		</nav>
	);
};

export default Navbar;
