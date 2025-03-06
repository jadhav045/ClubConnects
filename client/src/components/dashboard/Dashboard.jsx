import React, { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
	const user = true;

	if (!user) return <p>Loading...</p>;

	return (
		<div className="flex">
			<Sidebar user={user} />
			<div className="flex-1">
				<Navbar user={user} />
				<main className="p-4">
					<h1 className="text-2xl font-bold">Dashboard</h1>
					<Outlet />{" "}
					{/* ✅ Moved here so child routes render inside Dashboard */}
				</main>
			</div>
		</div>
	);
};

export default Dashboard;
