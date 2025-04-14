import { useState } from "react";
import axios from "axios";

const AdvancedFileUpload = ({ onUploadSuccess }) => {
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState(null);

	const handleUpload = async (event) => {
		const file = event.target.files[0];

		// Validation
		if (file.size > 5000000) {
			// 5MB limit
			setError("File size too large");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await axios.post("/api/upload", formData, {
				onUploadProgress: (progressEvent) => {
					const percentage = Math.round(
						(progressEvent.loaded * 100) / progressEvent.total
					);
					setProgress(percentage);
				},
			});

			onUploadSuccess(response.data.url);
		} catch (error) {
			setError("Upload failed");
		}
	};

	return (
		<div className="upload-container">
			<input
				type="file"
				onChange={handleUpload}
				accept="image/*,application/pdf"
			/>
			{progress > 0 && (
				<progress
					value={progress}
					max="100"
				/>
			)}
			{error && <p className="error">{error}</p>}
		</div>
	);
};

export default AdvancedFileUpload;
