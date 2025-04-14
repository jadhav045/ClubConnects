import React, { useState } from "react";
import axios from "axios";
// import "./FileUpload.css";

const FileUpload = () => {
	const [file, setFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [uploadedFile, setUploadedFile] = useState(null);
	const [error, setError] = useState(null);

	// Handle file input change
	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);

		// Create a preview for image files
		if (selectedFile && selectedFile.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewUrl(reader.result);
			};
			reader.readAsDataURL(selectedFile);
		} else {
			setPreviewUrl(null);
		}

		// Clear previous upload results
		setUploadedFile(null);
		setError(null);
	};

	// Handle file upload
	const handleUpload = async () => {
		if (!file) {
			setError("Please select a file first");
			return;
		}

		// Create FormData object
		const formData = new FormData();
		formData.append("file", file);

		setUploading(true);
		setError(null);

		try {
			const response = await axios.post(
				"http://localhost:3002/file/upload/file",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			setUploadedFile(response.data);
			setUploading(false);
		} catch (err) {
			setError(err.response?.data?.message || "Error uploading file");
			setUploading(false);
		}
	};

	return (
		<div className="file-upload-container">
			<h2>Upload File to Cloudinary</h2>

			<div className="upload-area">
				<input
					type="file"
					onChange={handleFileChange}
					className="file-input"
					id="file-input"
				/>
				<label
					htmlFor="file-input"
					className="file-label"
				>
					Choose File
				</label>

				{file && (
					<div className="file-info">
						<p>Selected: {file.name}</p>
						{previewUrl && (
							<div className="preview-container">
								<img
									src={previewUrl}
									alt="Preview"
									className="file-preview"
								/>
							</div>
						)}
					</div>
				)}

				<button
					onClick={handleUpload}
					disabled={!file || uploading}
					className="upload-button"
				>
					{uploading ? "Uploading..." : "Upload to Cloudinary"}
				</button>
			</div>

			{error && <div className="error-message">{error}</div>}

			{uploadedFile && (
				<div className="upload-result">
					<h3>Upload Successful!</h3>
					<div className="result-details">
						<p>
							<strong>File name:</strong> {uploadedFile.originalname}
						</p>
						<p>
							<strong>Size:</strong> {Math.round(uploadedFile.size / 1024)} KB
						</p>
						<p>
							<strong>Type:</strong> {uploadedFile.mimetype}
						</p>
						{uploadedFile.url && (
							<>
								<p>
									<strong>Cloudinary URL:</strong>
								</p>
								<a
									href={uploadedFile.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									{uploadedFile.url}
								</a>
							</>
						)}
						{uploadedFile.url && uploadedFile.mimetype.startsWith("image/") && (
							<div className="uploaded-image">
								<img
									src={uploadedFile.url}
									alt="Uploaded"
								/>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default FileUpload;
