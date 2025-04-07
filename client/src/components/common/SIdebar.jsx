import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getSidebarItems } from "../../config/Items";
import { Box, IconButton, Menu, MenuItem, useMediaQuery } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Sidebar = ({ user }) => {
	const sidebarItems = getSidebarItems(user);
	const [anchorEl, setAnchorEl] = useState(null);
	const isSmallScreen = useMediaQuery("(max-width:600px)");

	// Handle opening the menu
	const handleClick = (event) => setAnchorEl(event.currentTarget);

	// Handle closing the menu
	const handleClose = () => setAnchorEl(null);

	return (
		<>
			<div className="w-64 h-screen bg-gray-900 text-white p-4">
				<h2 className="text-xl font-semibold mb-4">Dashboard</h2>

				{isSmallScreen ? (
					// For small screens, display the 3-dot icon and menu
					<Box>
						<IconButton onClick={handleClick}>
							<MoreVertIcon />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							{sidebarItems.map((item, index) => (
								<MenuItem
									key={index}
									onClick={handleClose}
								>
									<Link
										to={item.href}
										className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
									>
										<span>{item.icon}</span>
										<span>{item.name}</span>
									</Link>
								</MenuItem>
							))}
						</Menu>
					</Box>
				) : (
					// For larger screens, show the sidebar items as a list
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
				)}
				{/* <NotificationBell /> */}
			</div>
			<div></div>
		</>
	);
};

export default Sidebar;
