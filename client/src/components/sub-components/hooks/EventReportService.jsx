import axios from "axios";
import { API_URL, getToken } from "../../../routes/apiConfig";
// import { API_URL, getToken } from "../routes/apiConfig";

export const EventReportService = {
	generateReport: async (eventId) => {
		try {
			const token = getToken();
			const response = await axios.post(
				`${API_URL}/student/events/${eventId}/report/generate`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			return response.data;
		} catch (error) {
			throw error.response?.data || error;
		}
	},

	getReport: async (eventId) => {
		try {
			const token = getToken();
			const response = await axios.get(
				`${API_URL}/student/events/${eventId}/report`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			return response.data;
		} catch (error) {
			throw error.response?.data || error;
		}
	},
};
