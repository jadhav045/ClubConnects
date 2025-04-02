import React, { useState } from "react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

const Dashboard = () => {
	const user = true;
	const isSmallScreen = useMediaQuery("(max-width: 768px)");

	const [sidebarOpen, setSidebarOpen] = useState(!isSmallScreen); // Sidebar open/close state for small screens

	if (!user) return <p>Loading...</p>;

	return (
		<div className="flex h-screen">
			{/* Sidebar, visible only on larger screens */}
			<div className={`${isSmallScreen ? "hidden" : "w-64 fixed"} h-full`}>
				<Sidebar user={user} />
			</div>

			{/* Main content area with navbar */}
			<div
				className={`flex-1 flex flex-col ${isSmallScreen ? "ml-0" : "ml-64"}`}
			>
				{/* Fixed Navbar at the top */}
				<div className="fixed w-full z-10 mr-20">
					<Navbar
						user={user}
						sidebarOpen={sidebarOpen}
					/>
				</div>

				{/* Scrollable main content */}
				<main className="p-4 flex-1 mt-16 overflow-auto">
					<Outlet /> {/* Render child components here */}
				</main>
			</div>
		</div>
	);
};

export default Dashboard;
