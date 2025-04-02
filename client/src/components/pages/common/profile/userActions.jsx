import axios from "axios";
import { API_URL, getToken } from "../../../../routes/apiConfig";

export const followUser = async (userId, token) => {
	try {
		const token = getToken();
		const res = await axios.post(
			`${API_URL}/connections/follow/${userId}`,
			{}, // Empty body if not needed
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res.data;
	} catch (err) {
		console.error("Error following user:", err);
		throw err;
	}
};

export const unfollowUser = async (userId) => {
	try {
		const token = getToken();
		const res = await axios.post(
			`${API_URL}/connections/unfollow/${userId}`,
			{}, // Empty body if not needed
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res.data;
	} catch (err) {
		console.error("Error unfollowing user:", err);
		throw err;
	}
};

export const sendConnectionRequest = async (userId) => {
	try {
		const token = getToken();
		const res = await axios.post(
			`${API_URL}/connections/connect/${userId}`,
			{}, // Empty body if not needed
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res.data;
	} catch (err) {
		console.error("Error sending connection request:", err);
		throw err;
	}
};

export const acceptConnectionRequest = async (requestId) => {
	try {
		const token = getToken();
		const res = await axios.post(
			`${API_URL}/connections/accept-connection/${requestId}`,
			{}, // Empty body if not needed
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res.data;
	} catch (err) {
		console.error("Error accepting connection:", err);
		throw err;
	}
};

export const cancelConnectionRequest = async (requestId) => {
	try {
		const token = getToken();
		const res = await axios.post(
			`${API_URL}/connections/cancel-connection/${requestId}`,
			{}, // Empty body if not needed
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res.data;
	} catch (err) {
		console.error("Error canceling connection request:", err);
		throw err;
	}
};
