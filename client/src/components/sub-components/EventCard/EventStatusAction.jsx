import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../routes/apiConfig";
import { motion, AnimatePresence } from "framer-motion"; // Add this import
import { CheckCircle } from "@mui/icons-material";

const EventStatusAction = ({
	isRegistered,
	isEventStarted,
	hasGivenAttendance,
	hasGivenFeedback,
	isEventClosed,
	onRegister,
	onGiveAttendance,
	onGiveFeedback,
	isOrganizer,
	isAttendanceOpen,
	onOpenAttendance,
}) => {
	// Button animation variants
	const buttonVariants = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
	};

	const renderButton = () => {
		if (isOrganizer && isEventStarted) {
			return (
				<motion.div
					{...buttonVariants}
					className="flex items-center gap-2"
				>
					{isAttendanceOpen ? (
						<motion.button
							onClick={onOpenAttendance}
							className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
						>
							<div className="h-2 w-2 bg-white rounded-full animate-pulse" />
							Attendance Open
						</motion.button>
					) : (
						<motion.div
							onClick={onOpenAttendance}
							className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md cursor-pointer flex items-center gap-2"
						>
							Attendance Close
						</motion.div>
					)}
				</motion.div>
			);
		}

		if (!isRegistered && isEventClosed) {
			return (
				<motion.div
					{...buttonVariants}
					className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md"
				>
					<CheckCircle className="text-gray-600" />
					Event Done
				</motion.div>
			);
		}

		if (!isRegistered) {
			return (
				<motion.button
					{...buttonVariants}
					onClick={onRegister}
					className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
				>
					Register Now
				</motion.button>
			);
		}

		if (isRegistered && !isEventStarted) {
			return (
				<motion.div
					{...buttonVariants}
					className="px-4 py-2 bg-green-100 text-green-800 rounded-md"
				>
					Registered Successfully
				</motion.div>
			);
		}

		if (isEventStarted && !hasGivenAttendance && isAttendanceOpen) {
			return (
				<motion.button
					{...buttonVariants}
					onClick={onGiveAttendance}
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
				>
					Enter Attendance Code
				</motion.button>
			);
		}

		if (hasGivenAttendance && !hasGivenFeedback) {
			return (
				<motion.button
					{...buttonVariants}
					onClick={onGiveFeedback}
					className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
				>
					Give Feedback
				</motion.button>
			);
		}

		if (hasGivenFeedback) {
			return (
				<motion.div
					{...buttonVariants}
					className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-md"
				>
					<CheckCircle className="text-green-600" />
					Event Done
				</motion.div>
			);
		}

		return null;
	};

	return <AnimatePresence mode="wait">{renderButton()}</AnimatePresence>;
};

export const useEventStatus = (event, userId) => {
	const [status, setStatus] = useState({
		hasGivenAttendance: false,
		hasGivenFeedback: false,
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		const fetchEventStatus = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/events/${event._id}/status/${userId}`
				);

				setStatus({
					hasGivenAttendance: response.data.hasGivenAttendance,
					hasGivenFeedback: response.data.hasGivenFeedback,
					isLoading: false,
					error: null,
				});
			} catch (error) {
				setStatus((prev) => ({
					...prev,
					isLoading: false,
					error: "Failed to fetch event status",
				}));
			}
		};

		if (event._id && userId) {
			fetchEventStatus();
		}
	}, [event._id, userId]);

	return status;
};
export default EventStatusAction;
