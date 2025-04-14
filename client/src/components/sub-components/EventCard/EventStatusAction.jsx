import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../routes/apiConfig";

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
	if (isOrganizer && isEventStarted) {
		return (
			<button
				onClick={onOpenAttendance}
				className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
			>
				{isAttendanceOpen ? "Attendance Open" : "Give Attendance"}
			</button>
		);
	}

	if (!isRegistered && isEventClosed) {
		return (
			<button
				disabled
				className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
			>
				Registration Closed
			</button>
		);
	}

	if (!isRegistered) {
		return (
			<button
				onClick={onRegister}
				className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
			>
				Register Now
			</button>
		);
	}

	if (isRegistered && !isEventStarted) {
		return (
			<div className="px-4 py-2 bg-green-100 text-green-800 rounded-md">
				Registered Successfully
			</div>
		);
	}

	console.log("hasGivenAttendance", hasGivenAttendance);
	if (isEventStarted && !hasGivenAttendance && isAttendanceOpen) {
		return (
			<button
				onClick={onGiveAttendance}
				className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
			>
				Enter Attendance Code
			</button>
		);
	}

	if (hasGivenAttendance && !hasGivenFeedback) {
		return (
			<button
				onClick={onGiveFeedback}
				className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
			>
				Give Feedback
			</button>
		);
	}

	if (hasGivenFeedback) {
		return (
			<span className="px-4 py-2 bg-green-100 text-green-800 rounded-md">
				Feedback Submitted
			</span>
		);
	}

	return null;
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
