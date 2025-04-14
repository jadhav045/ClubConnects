import axios from "axios";
import { getToken, API_URL } from "../../../../routes/apiConfig";
// import { API_URL, getToken } from "../../../../routes/apiConfig";

// 1. Add Achievement
export const addAchievement = async (clubId, achievementData) => {
	try {
		const token = getToken();

		const formData = new FormData();
		formData.append("title", achievementData.title);
		formData.append("description", achievementData.description);
		formData.append("date", achievementData.date);
		if (achievementData.image) {
			formData.append("image", achievementData.image); // for cloudinary
			console.log("Image File:", achievementData.image);
		}

		const response = await axios.post(
			`${API_URL}/student/club/${clubId}/achievement`,
			formData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error adding achievement:", error);
		throw error;
	}
};

// 2. Delete Achievement
export const deleteAchievement = async (clubId, achievementId) => {
	try {
		const token = getToken();

		const response = await axios.delete(
			`${API_URL}/student/club/${clubId}/achievement/${achievementId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error deleting achievement:", error);
		throw error;
	}
};

// 3. Update Achievement
export const updateAchievement = async (clubId, achievementId, updatedData) => {
	try {
		const token = getToken();

		const formData = new FormData();
		formData.append("title", updatedData.title);
		formData.append("description", updatedData.description);
		formData.append("date", updatedData.date);
		if (updatedData.image) {
			formData.append("image", updatedData.image); // for cloudinary
			console.log("Updated Image File:", updatedData.image);
		}

		const response = await axios.put(
			`${API_URL}/student/club/${clubId}/achievement/${achievementId}`,
			formData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error updating achievement:", error);
		throw error;
	}
};
