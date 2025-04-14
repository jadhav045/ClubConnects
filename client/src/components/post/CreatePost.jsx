import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { ImagePlus, Loader } from "lucide-react";
// import { MdOutlineAddPhotoAlternate } from "react-icons/md";

const categories = [
	"Announcement",
	"Event",
	"Discussion",
	"Study Material",
	"Others",
];

const CreatePost = ({ onSubmit }) => {
	const [text, setText] = useState("");
	const [category, setCategory] = useState(categories[0]);
	const [tags, setTags] = useState("");
	const [isUploading, setIsUploading] = useState(false);
	const [attachments, setAttachments] = useState([]);

	const removeAttachment = (index) => {
		setAttachments(attachments.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsUploading(true);
		try {
			const token = localStorage.getItem("token");
			if (!token) throw new Error("No token found");

			const formData = new FormData();
			formData.append("text", text.trim());
			formData.append("category", category);
			formData.append("tags", JSON.stringify(tags.length > 0 ? tags : []));

			if (attachments.length > 0) {
				attachments.forEach((file) => formData.append("attachments", file));
			}

			const res = await axios.post("http://localhost:3002/post", formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			if (onSubmit) onSubmit(res.data);
			toast.success("Post created successfully!");
			setText("");
			setCategory(categories[0]);
			setTags("");
			setAttachments([]);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to create post!");
		} finally {
			setIsUploading(false);
		}
	};

	const handleFileChange = (event) => {
		const files = Array.from(event.target.files);
		setAttachments([...attachments, ...files]);
	};

	return (
		<div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-5 space-y-5">
			<h2 className="text-xl font-bold text-gray-900">Create a New Post</h2>
			<textarea
				className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-400"
				placeholder="Write a caption..."
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<div className="flex space-x-2">
				<select
					className="flex-1 p-2 border rounded-lg"
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
				<input
					type="text"
					className="flex-1 p-2 border rounded-lg"
					placeholder="#tags"
					value={tags}
					onChange={(e) => setTags(e.target.value)}
				/>
			</div>
			<div className="mt-4 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition">
				<label className="block text-gray-600">
					<ImagePlus className="text-4xl mx-auto text-gray-400" />
					<span className="text-sm">Click to upload or drag files here</span>
					<input
						type="file"
						className="hidden"
						multiple
						onChange={handleFileChange}
						accept="image/*, video/*"
					/>
				</label>
			</div>

			{attachments.length > 0 && (
				<div className="grid grid-cols-3 gap-3 mt-4">
					{attachments.map((file, index) => (
						<div
							key={index}
							className="relative group overflow-hidden rounded-lg shadow-md"
						>
							<img
								src={URL.createObjectURL(file)}
								alt="Preview"
								className="w-full h-24 object-cover"
							/>
							<button
								onClick={() => removeAttachment(index)}
								className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
							>
								<FaTimes className="text-xs" />
							</button>
						</div>
					))}
				</div>
			)}

			<button
				onClick={handleSubmit}
				disabled={isUploading}
				className="w-full mt-4 py-3 text-white font-medium rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-600 hover:to-blue-600 transition"
			>
				{isUploading ? "Posting..." : "Post"}
			</button>
		</div>
	);
};

export default CreatePost;
