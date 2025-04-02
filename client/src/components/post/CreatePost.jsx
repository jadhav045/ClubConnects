import React, { useState } from "react";

import axios from "axios";
import uploadToCloudinary from "./uploadToCloudinary";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MegaphoneIcon } from "lucide-react";
import { IoMdAttach } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { FiUploadCloud, FiLoader } from "react-icons/fi";

// import uploadToCloudinary from "./uploadToCloudinary";

// Categories Enum
const categories = [
	"Announcement",
	"Event",
	"Discussion",
	"Study Material",
	"Others",
];

const CreatePost = ({ onSubmit }) => {
	const [text, setText] = useState("");
	const [category, setCategory] = useState(categories[0]); // Default selection
	const [tags, setTags] = useState("");
	const [attachments, setAttachments] = useState([]);
	const [isUploading, setIsUploading] = useState(false);

	// Handle File Upload
	const handleFileUpload = async (event) => {
		try {
			const files = event.target.files;
			setIsUploading(true);

			for (const file of Array.from(files)) {
				// Upload to Cloudinary and get URL
				const cloudinaryUrl = await uploadToCloudinary(file);

				if (cloudinaryUrl) {
					setAttachments((prev) => [
						...prev,
						{
							fileUrl: cloudinaryUrl,
							fileType: file.type.includes("video") ? "mp4" : "jpg",
						},
					]);
				}
			}
		} catch (error) {
			console.error("Error handling file upload:", error);
			// Optionally show error to user
			alert("Failed to upload one or more files");
		} finally {
			setIsUploading(false);
		}
	};

	// Remove Attachment
	const removeAttachment = (index) => {
		setAttachments(attachments.filter((_, i) => i !== index));
	};

	// Handle Form Submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		const postData = {
			text,
			category,
			tags: tags.split(",").map((tag) => tag.trim()),
			attachments: attachments.map((att) => ({
				fileUrl: att.fileUrl,
				fileType: att.fileType,
			})),
		};

		try {
			const token = localStorage.getItem("token");
			if (!token) throw new Error("No token found");

			const res = await axios.post("http://localhost:3002/post", postData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (onSubmit) onSubmit(res.data);

			toast.success("Post created successfully!", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "colored",
			});

			// Clear form after successful submission
			setText("");
			setCategory(categories[0]);
			setTags("");
			setAttachments([]);
		} catch (error) {
			console.error("Error creating post:", error);

			toast.error(error.response?.data?.message || "Failed to create post!", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "colored",
			});
		}
	};

	return (
		<div className="relative max-h-[90vh] flex flex-col bg-white rounded-xl shadow-xl border border-gray-100">
			{/* Header - Fixed at top */}
			<div className="sticky top-0 z-10 bg-white p-6 border-b border-gray-100 rounded-t-xl">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-blue-100 rounded-lg">
						<MegaphoneIcon className="w-6 h-6 text-blue-600" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900">
						Create Club Announcement
					</h2>
				</div>
			</div>

			{/* Scrollable Content */}
			<div className="flex-1 overflow-y-auto p-6">
				<div className="space-y-6">
					{/* Text Input */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">
							What's happening?
						</label>
						<textarea
							className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder-gray-400 min-h-[120px]"
							placeholder="Share updates, announcements, or event details..."
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
					</div>

					{/* Category & Tags */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Category Dropdown */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								Category
							</label>
							<div className="relative">
								<select
									className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none  bg-no-repeat bg-[center_right_1rem]"
									value={category}
									onChange={(e) => setCategory(e.target.value)}
								>
									{categories.map((cat, index) => (
										<option
											key={index}
											value={cat}
										>
											{cat}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Tags Input */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">
								Add Tags
							</label>
							<input
								type="text"
								className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder-gray-400"
								placeholder="#fundraiser #event #meeting"
								value={tags}
								onChange={(e) => setTags(e.target.value)}
							/>
						</div>
					</div>

					{/* File Upload */}
					<div className="space-y-3">
						<label className="text-sm font-medium text-gray-700">
							Media Attachments
						</label>
						<label
							className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed ${
								isUploading
									? "border-gray-200"
									: "border-gray-300 hover:border-blue-500 cursor-pointer"
							} transition-colors`}
						>
							<div className="text-center">
								<FaTimes className="w-8 h-8 text-gray-400 mx-auto mb-3" />
								<p className="text-gray-600">
									{isUploading
										? "Uploading files..."
										: "Drag & drop files or click to upload"}
								</p>
								<p className="text-sm text-gray-500 mt-1">
									Supports: JPEG, PNG, MP4 (max 5 files)
								</p>
							</div>
							<input
								type="file"
								multiple
								className="hidden"
								onChange={handleFileUpload}
								disabled={isUploading}
							/>
						</label>
					</div>

					{/* Attachment Preview */}
					{attachments.length > 0 && (
						<div className="grid grid-cols-3 gap-3">
							{attachments.map((file, index) => (
								<div
									key={index}
									className="relative group"
								>
									{file.fileType === "video" ? (
										<video
											src={file.fileUrl}
											controls
											className="w-full h-32 rounded-lg object-cover"
										/>
									) : (
										<img
											src={file.fileUrl}
											alt={`Attachment ${index + 1}`}
											className="w-full h-32 rounded-lg object-cover"
										/>
									)}
									<button
										onClick={() => removeAttachment(index)}
										className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
									>
										<FaTimes className="w-4 h-4" />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Footer - Fixed at bottom */}
			<div className="sticky bottom-0 z-10 bg-white p-6 border-t border-gray-100 rounded-b-xl">
				<button
					onClick={handleSubmit}
					disabled={isUploading}
					className={`w-full py-3.5 rounded-xl text-white font-medium transition-all ${
						isUploading
							? "bg-gray-400 cursor-not-allowed"
							: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-blue-200"
					}`}
				>
					{isUploading ? (
						<span className="flex items-center justify-center gap-2">
							<FaTimes className="animate-spin w-5 h-5" />
							Posting...
						</span>
					) : (
						"Publish Announcement"
					)}
				</button>
			</div>
		</div>
	);
};

export default CreatePost;
