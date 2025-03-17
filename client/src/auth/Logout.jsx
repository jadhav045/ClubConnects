import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import axios from "axios";
import { toast } from "react-toastify";
import { logoutUser } from "../store/slice/authSlice";

const Logout = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleLogout = async () => {
		try {
			await axios.post("http://localhost:3002/auth/logout");
			dispatch(logoutUser()); // Clear Redux auth state
			toast.success("Logout successful");
			navigate("/login"); // Navigate to the login page
		} catch (error) {
			// console.error("Logout failed:", error.response?.data || error.message);
			toast.error("Logout failed");
		}
	};

	return (
		<button
			onClick={handleLogout}
			className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
		>
			Logout
		</button>
	);
};

export default Logout;
