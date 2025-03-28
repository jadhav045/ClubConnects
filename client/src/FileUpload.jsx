import { useState } from "react";
import axios from "axios";

const FileUpload = ({ onUploadSuccess }) => {
	const [loading, setLoading] = useState(false);
	const [preview, setPreview] = useState(null);
	const [error, setError] = useState(null);

	const ALLOWED_TYPES = [
		"image/jpeg",
		"image/png",
		"image/gif",
		"application/pdf",
	];
	const MAX_SIZE = 5 * 1024 * 1024; // 5MB

	const handleUpload = async (event) => {
		try {
			const file = event.target.files[0];

			// Validation
			if (!ALLOWED_TYPES.includes(file.type)) {
				setError("File type not supported");
				return;
			}

			if (file.size > MAX_SIZE) {
				setError("File size must be less than 5MB");
				return;
			}

			// Show preview before upload
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setPreview(reader.result);
				};
				reader.readAsDataURL(file);
			}

			setLoading(true);
			setError(null);

			const formData = new FormData();
			formData.append("file", file);
			formData.append(
				"upload_preset",
				"react_upload"
			);

			const response = await axios.post(
				`https://api.cloudinary.com/v1_1/dlhjllguo/upload`,
				formData,
				{
					onUploadProgress: (progressEvent) => {
						const percentage = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
						console.log(`Upload Progress: ${percentage}%`);
					},
				}
			);

			const { secure_url, public_id } = response.data;
			setPreview(secure_url);
			onUploadSuccess({ url: secure_url, publicId: public_id });
		} catch (error) {
			console.error("Upload failed:", error);
			setError("Upload failed. Please try again.");
			setPreview(null);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			<div className="w-full max-w-md">
				<label className="flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors">
					<svg
						className="w-8 h-8"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
					>
						<path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
					</svg>
					<span className="mt-2 text-sm">Select a file</span>
					<input
						type="file"
						className="hidden"
						onChange={handleUpload}
						accept={ALLOWED_TYPES.join(",")}
						disabled={loading}
					/>
				</label>
			</div>

			{loading && (
				<div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
					<div className="bg-blue-600 h-2.5 rounded-full animate-pulse"></div>
				</div>
			)}

			{error && (
				<div className="w-full max-w-md p-4 text-red-500 bg-red-100 rounded-lg">
					{error}
				</div>
			)}

			{preview && (
				<div className="w-full max-w-md mt-4">
					{preview.match(/\.(jpg|jpeg|png|gif)$/i) ? (
						<img
							src={preview}
							alt="Upload preview"
							className="w-full rounded-lg shadow-lg"
						/>
					) : (
						<div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
							<svg
								className="w-8 h-8 text-gray-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<a
								href={preview}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-500 hover:underline"
							>
								View uploaded file
							</a>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default FileUpload;
