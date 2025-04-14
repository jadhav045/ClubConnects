import { useState } from "react";
import {
	Button,
	Input,
	TextareaAutosize,
	CircularProgress,
	Typography,
	CardContent,
} from "@mui/material";
import DialogComponent from "../../../common/DialogComponent";
import axios from "axios";

import { API_URL, getToken } from "../../../../routes/apiConfig";

import { FaTimes } from "react-icons/fa";
export const UpdateClubProfile = ({ club, open, setOpen }) => {
	const [formData, setFormData] = useState({
		clubName: club?.clubName || "",
		shortName: club?.shortName || "",
		motto: club?.motto || "",
		description: club?.description || "",
		socialLinks: {
			linkedIn: club?.socialLinks?.linkedIn || "",
			twitter: club?.socialLinks?.twitter || "",
			github: club?.socialLinks?.github || "",
			personalWebsite: club?.socialLinks?.personalWebsite || "",
		},
	});

	const [loading, setLoading] = useState(false);
	const [attachments, setAttachments] = useState([]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name.startsWith("socialLinks.")) {
			const key = name.split(".")[1];
			setFormData((prev) => ({
				...prev,
				socialLinks: { ...prev.socialLinks, [key]: value },
			}));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleFileChange = (event) => {
		const files = event.target.files;
		if (!files) return;
		setAttachments([...attachments, ...files]);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const token = getToken();
			const formDataToSend = new FormData();

			// Append only fields that have values
			Object.entries(formData).forEach(([key, value]) => {
				if (value && value !== "") {
					if (typeof value === "object" && !Array.isArray(value)) {
						// Handle nested socialLinks separately
						Object.entries(value).forEach(([subKey, subValue]) => {
							if (subValue && subValue !== "") {
								formDataToSend.append(`${key}[${subKey}]`, subValue);
							}
						});
					} else {
						formDataToSend.append(key, value);
					}
				}
			});

			// Append only one file if available
			if (attachments.length > 0) {
				formDataToSend.append("file", attachments[0]);
			}

			// Debugging - Log FormData content
			for (let pair of formDataToSend.entries()) {
				console.log(pair[0], pair[1]);
			}

			await axios.put(`${API_URL}/student/club/${club._id}`, formDataToSend, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			setOpen(false);
		} catch (error) {
			console.error("Error updating club profile:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<DialogComponent
			title="Update Club Profile"
			open={open}
			onClose={() => setOpen(false)}
		>
			<form
				onSubmit={handleSubmit}
				className="space-y-4 p-4"
			>
				{/* File Upload */}
				<div className="space-y-3">
					<label className="text-sm font-medium text-gray-700">
						Media Attachments
					</label>
					<label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed hover:border-blue-500 cursor-pointer transition-colors">
						<div className="text-center">
							<FaTimes className="w-8 h-8 text-gray-400 mx-auto mb-3" />
							<p className="text-gray-600">
								Drag & drop files or click to upload
							</p>
							<p className="text-sm text-gray-500 mt-1">
								Supports: JPEG, PNG, MP4
							</p>
						</div>
						<input
							type="file"
							className="hidden"
							multiple
							onChange={handleFileChange}
						/>
					</label>
				</div>
				{/* Club Name */}
				<label className="block font-medium text-gray-700">Club Name</label>
				<Input
					name="clubName"
					value={formData.clubName || ""}
					onChange={handleChange}
					fullWidth
					required
				/>

				{/* Short Name */}
				<label className="block font-medium text-gray-700">Short Name</label>
				<Input
					name="shortName"
					value={formData.shortName || ""}
					onChange={handleChange}
					fullWidth
					required
				/>

				{/* Motto */}
				<label className="block font-medium text-gray-700">Motto</label>
				<TextareaAutosize
					name="motto"
					value={formData.motto || ""}
					onChange={handleChange}
					className="w-full border p-2 rounded-md"
				/>

				{/* Description */}
				<label className="block font-medium text-gray-700">Description</label>
				<TextareaAutosize
					name="description"
					value={formData.description || ""}
					onChange={handleChange}
					className="w-full border p-2 rounded-md"
				/>

				{/* Social Links */}
				<div className="grid grid-cols-2 gap-2">
					<div>
						<label className="block font-medium text-gray-700">LinkedIn</label>
						<Input
							name="socialLinks.linkedIn"
							value={formData.socialLinks?.linkedIn || ""}
							onChange={handleChange}
							fullWidth
						/>
					</div>
					<div>
						<label className="block font-medium text-gray-700">Twitter</label>
						<Input
							name="socialLinks.twitter"
							value={formData.socialLinks?.twitter || ""}
							onChange={handleChange}
							fullWidth
						/>
					</div>
					<div>
						<label className="block font-medium text-gray-700">GitHub</label>
						<Input
							name="socialLinks.github"
							value={formData.socialLinks?.github || ""}
							onChange={handleChange}
							fullWidth
						/>
					</div>
					<div>
						<label className="block font-medium text-gray-700">Website</label>
						<Input
							name="socialLinks.personalWebsite"
							value={formData.socialLinks?.personalWebsite || ""}
							onChange={handleChange}
							fullWidth
						/>
					</div>
				</div>

				{/* Save Button */}
				<Button
					type="submit"
					className="w-full bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-green-600"
				>
					Save Changes
				</Button>
			</form>
		</DialogComponent>
	);
};
