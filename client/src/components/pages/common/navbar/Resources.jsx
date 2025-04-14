import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// import React, { useState } from "react";
// import axios from "axios";
import ClubProfileCard from "../profile/ClubProfileCard";
import { API_URL, getToken } from "../../../../routes/apiConfig";
import { CircularProgress } from "@mui/material";

const Resources = () => {
	return (
		<div className="py-8 px-4">
			{/* <ClubProfileCard data={club} /> */}
			re
		</div>
	);
};

export default Resources;

const FileUpload = () => {
	const [files, setFiles] = useState([]);

	// Handle file selection
	const handleFileChange = (e) => {
		setFiles([...e.target.files]);
	};

	// Handle upload request
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (files.length === 0) {
			alert("Please select at least one file");
			return;
		}

		const formData = new FormData();
		files.forEach((file) => {
			formData.append("resources", file);
		});

		try {
			const res = await axios.post(
				"http://localhost:3002/auth/upload",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);

			console.log("Uploaded:", res.data);
			alert("Files uploaded successfully!");
		} catch (error) {
			console.error("Upload failed:", error);
			alert("File upload failed");
		}
	};

	return (
		<div>
			<h2>Upload Multiple Files</h2>
			<input
				type="file"
				multiple
				onChange={handleFileChange}
			/>
			<button onClick={handleSubmit}>Upload</button>
		</div>
	);
};

``;
