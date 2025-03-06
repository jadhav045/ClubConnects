import React from "react";
import { Link } from "react-router-dom";
import { getSidebarItems } from "../../config/Items";

const Sidebar = ({ user }) => {
	const sidebarItems = getSidebarItems(user);

	return (
		<div className="w-64 h-screen bg-gray-900 text-white p-4">
			<h2 className="text-xl font-semibold mb-4">Dashboard</h2>
			<ul>
				{sidebarItems.map((item, index) => (
					<li
						key={index}
						className="mb-2"
					>
						<Link
							to={item.href}
							className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
						>
							<span>{item.icon}</span>
							<span>{item.name}</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
