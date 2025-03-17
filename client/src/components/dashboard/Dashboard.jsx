import React from "react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
	const user = true;

	if (!user) return <p>Loading...</p>;

	return (
		<div className="flex h-screen">
			{/* Fixed Sidebar on the left */}
			<div className="w-64 fixed h-full">
				<Sidebar user={user} />
			</div>

			{/* Main content area with navbar */}
			<div className="flex-1 flex flex-col ml-64">
				{/* Fixed Navbar at the top */}
				<div className="fixed w-[calc(100%-16rem)] z-10">
					<Navbar user={user} />
				</div>

				{/* Scrollable main content */}
				<main className="p-4 flex-1 mt-16 overflow-auto">
					{/* <h1 className="text-2xl font-bold mb-4">Dashboard</h1> */}
					<Outlet /> {/* Render child components here */}
				</main>
			</div>
		</div>
	);
};

export default Dashboard;
