import { useState } from "react";
import axios from "axios";
import { API_URL, getToken } from "../../../routes/apiConfig";
// import { API_URL } from "../config";

export const useAttendance = (eventId) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const openAttendance = async (code, duration = 30) => {
		setIsLoading(true);
		try {
			const response = await axios.post(
				`${API_URL}/student/events/${eventId}/attendance/open`,
				{ code, duration },
				{ withCredentials: true }
			);

			return response.data;
		} catch (err) {
			setError(err.response?.data?.message || "Failed to open attendance");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const markAttendance = async (code) => {
		setIsLoading(true);
		try {
			const token = getToken();
			const response = await axios.post(
				`${API_URL}/student/events/${eventId}/attendance`,
				{ code },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					withCredentials: true,
				}
			);
			return response.data;
		} catch (err) {
			setError(err.response?.data?.message || "Failed to mark attendance");
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		openAttendance,
		markAttendance,
		isLoading,
		error,
	};
};
