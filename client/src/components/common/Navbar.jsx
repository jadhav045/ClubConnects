import React from "react";
import { Link } from "react-router-dom";
import { getNavbarItems } from "../../config/Items";
import Logout from "../../auth/LogOut";

const Navbar = ({ user }) => {
	const navbarItems = getNavbarItems(user);

	return (
		<nav className="bg-gray-800 text-white px-4 py-3 flex justify-between">
			<div className="flex space-x-4">
				{navbarItems.map((item, index) => (
					<div
						key={index}
						className="relative group"
					>
						<Link
							to={item.href}
							className="px-3 py-2 hover:bg-gray-700 rounded"
						>
							{item.name}
						</Link>
					</div>
				))}
			</div>
			{/* Add the logout button on the right side of the navbar */}
			<div>
				<Logout />
			</div>
		</nav>
	);
};

export default Navbar;
