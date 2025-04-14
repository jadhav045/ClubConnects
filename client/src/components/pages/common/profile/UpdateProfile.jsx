import React, { useState } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";

import { toast, ToastContainer } from "react-toastify";
import { API_URL, getToken } from "../../../../routes/apiConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
const UpdateProfile = ({ user, closeModal }) => {
	const [formData, setFormData] = useState({
		fullName: user.fullName || "",
		email: user.email || "",
		phoneNumber: user.phoneNumber || "",
		socialLinks: user.socialLinks || {
			linkedIn: "",
			twitter: "",
			github: "",
			personalWebsite: "",
		},
		awards: user.awards || [],
		address: user.address || {
			street: "",
			city: "",
			state: "",
			zipCode: "",
			country: "",
		},
	});

	const [attachments, setAttachments] = useState([]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSocialLinkChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			socialLinks: {
				...prev.socialLinks,
				[name]: value,
			},
		}));
	};

	const handleAddressChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			address: {
				...prev.address,
				[name]: value,
			},
		}));
	};

	// Handle Awards Change
	const handleAwardChange = (index, e) => {
		const { name, value } = e.target;
		const updatedAwards = [...formData.awards];
		updatedAwards[index] = { ...updatedAwards[index], [name]: value };
		setFormData((prev) => ({ ...prev, awards: updatedAwards }));
	};

	// Handle Image Upload for Awards
	const handleImageChange = (index, e) => {
		const file = e.target.files[0];
		if (file) {
			const updatedAwards = [...formData.awards];
			updatedAwards[index].image = URL.createObjectURL(file);
			setFormData((prev) => ({ ...prev, awards: updatedAwards }));
		}
	};

	// Add New Award
	const addAward = () => {
		setFormData((prev) => ({
			...prev,
			awards: [
				...prev.awards,
				{ title: "", description: "", date: "", image: "" },
			],
		}));
	};

	const navigate = useNavigate();
	// Remove an Award
	const removeAward = (index) => {
		const updatedAwards = formData.awards.filter((_, i) => i !== index);
		setFormData((prev) => ({ ...prev, awards: updatedAwards }));
	};

	const handleSubmit = async (e) => {
		console.log("as", formData);
		e.preventDefault();

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
		const res = await axios.put(
			`${API_URL}/auth/updateProfile`,
			formDataToSend,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			}
		);
		navigate(`/${user.role}/profile/${user._id}`);
		closeModal();
		if (!formData.email) {
			toast.error("Email is required!");
			return;
		}

		// Simulate API call or validation
		setTimeout(() => {
			toast.success("Profile updated successfully!");
			// closeModal();
		}, 1000);
	};
	const handleFileChange = (event) => {
		const files = event.target.files;
		if (!files) return;
		setAttachments([...attachments, ...files]);
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
			<ToastContainer
				position="top-right"
				reverseOrder={false}
			/>
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-blue-50">
				{/* Header with gradient */}
				<div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-t-2xl">
					<div className="flex justify-between items-center">
						<h2 className="text-2xl font-bold text-white flex items-center gap-2">
							<FiUploadCloud className="w-6 h-6" />
							Update Profile
						</h2>
						<button
							onClick={closeModal}
							className="text-white hover:text-blue-200 transition-colors"
						>
							<FaTimes className="w-6 h-6" />
						</button>
					</div>
				</div>

				<form
					onSubmit={handleSubmit}
					className="p-8 space-y-8"
				>
					

					{/* Personal Info Section */}
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								label="Full Name"
								name="fullName"
								value={formData.fullName}
								onChange={handleChange}
								icon="👤"
							/>
							<FormField
								label="Email"
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								icon="✉️"
								required
							/>
							<FormField
								label="Phone Number"
								name="phoneNumber"
								value={formData.phoneNumber}
								onChange={handleChange}
								icon="📱"
							/>
						</div>
					</div>

					{/* Address Section */}
					<SectionCard
						title="Address"
						icon="🏠"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{["street", "city", "state", "zipCode", "country"].map(
								(field) => (
									<FormField
										key={field}
										label={field.replace(/([A-Z])/g, " $1")}
										name={field}
										value={formData.address[field]}
										onChange={handleAddressChange}
										capitalize
									/>
								)
							)}
						</div>
					</SectionCard>

					{/* Social Links Section */}
					<SectionCard
						title="Social Links"
						icon="🌐"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{["linkedIn", "twitter", "github", "personalWebsite"].map(
								(link) => (
									<FormField
										key={link}
										label={link}
										name={link}
										value={formData.socialLinks[link]}
										onChange={handleSocialLinkChange}
										prefix="https://"
									/>
								)
							)}
						</div>
					</SectionCard>

					{/* Awards Section */}
					<SectionCard
						title="Awards & Achievements"
						icon="🏆"
					>
						{formData.awards.map((award, index) => (
							<div
								key={index}
								className="group relative p-6 bg-white rounded-lg border border-blue-100 hover:border-blue-200 shadow-sm mb-4 transition-all"
							>
								<button
									type="button"
									onClick={() => removeAward(index)}
									className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-md"
								>
									<FaTimes className="w-4 h-4" />
								</button>

								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											label="Title"
											name="title"
											value={award.title}
											onChange={(e) => handleAwardChange(index, e)}
										/>
										<FormField
											label="Date"
											type="date"
											name="date"
											value={award.date}
											onChange={(e) => handleAwardChange(index, e)}
										/>
									</div>
									<FormField
										label="Description"
										name="description"
										value={award.description}
										onChange={(e) => handleAwardChange(index, e)}
										textarea
									/>
									<div className="space-y-2">
										<label className="block text-sm font-medium text-blue-600">
											Award Image
										</label>
										<div className="flex items-center gap-4">
											<input
												type="file"
												accept="image/*"
												onChange={(e) => handleImageChange(index, e)}
												className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
											/>
											{award.image && (
												<img
													src={award.image}
													alt="Award Preview"
													className="w-16 h-16 object-cover rounded-lg border border-blue-100"
												/>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
						<button
							type="button"
							onClick={addAward}
							className="w-full py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
						>
							<span className="text-xl">+</span> Add New Award
						</button>
					</SectionCard>

					{/* Form Actions */}
					<div className="flex justify-end gap-4 pt-6 border-t border-blue-100">
						<button
							type="button"
							onClick={closeModal}
							className="px-8 py-3 text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all font-medium"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5 font-medium shadow-sm"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

// Reusable Components
const SectionCard = ({ title, icon, children }) => (
	<div className="p-6 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
		<div className="flex items-center gap-2 text-blue-700 mb-4">
			<span className="text-xl">{icon}</span>
			<h3 className="font-semibold text-lg">{title}</h3>
		</div>
		{children}
	</div>
);

const FormField = ({
	label,
	name,
	type = "text",
	value,
	onChange,
	textarea,
	required,
	icon,
	prefix,
	capitalize,
}) => (
	<div className="space-y-1">
		<label className="block text-sm font-medium text-blue-600">
			{icon && <span className="mr-2">{icon}</span>}
			{label}
			{required && <span className="text-red-500 ml-1">*</span>}
		</label>
		<div className="relative">
			{prefix && (
				<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
					{prefix}
				</span>
			)}
			{textarea ? (
				<textarea
					name={name}
					value={value}
					onChange={onChange}
					required={required}
					className={`w-full px-4 py-2.5 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all ${
						prefix ? "pl-10" : ""
					} ${capitalize ? "capitalize" : ""}`}
					rows="3"
				/>
			) : (
				<input
					type={type}
					name={name}
					value={value}
					onChange={onChange}
					required={required}
					className={`w-full px-4 py-2.5 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition-all ${
						prefix ? "pl-10" : ""
					} ${capitalize ? "capitalize" : ""}`}
				/>
			)}
		</div>
	</div>
);

export default UpdateProfile;
