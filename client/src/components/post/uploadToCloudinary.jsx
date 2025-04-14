import axios from "axios";
import { CLOUDINARY_CONFIG } from "../../config/cloudinary";

const uploadToCloudinary = async (file) => {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);
		formData.append("cloud_name", CLOUDINARY_CONFIG.CLOUD_NAME);

		const response = await axios.post(CLOUDINARY_CONFIG.API_URL, formData);

		return response.data.secure_url;
	} catch (error) {
		console.error("Error uploading to Cloudinary:", error);
		throw new Error("Failed to upload file");
	}
};

export default uploadToCloudinary;
