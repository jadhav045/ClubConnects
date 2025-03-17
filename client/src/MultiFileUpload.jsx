import { useState } from "react";

const MultiFileUpload = () => {
	const [files, setFiles] = useState([]);
	const [urls, setUrls] = useState([]);

	const handleFileChange = (e) => {
		const newFiles = Array.from(e.target.files);
		setFiles((prevFiles) => [...prevFiles, ...newFiles]);
	};

	const uploadFiles = async () => {
		const uploadPromises = files.map((file) => {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", "react_upload");

			let resourceType = "auto";
			if (file.type.startsWith("video/")) {
				resourceType = "video";
			} else if (file.type === "application/pdf") {
				resourceType = "raw";
			}

			return fetch(
				`https://api.cloudinary.com/v1_1/dlhjllguo/${resourceType}/upload`,
				{
					method: "POST",
					body: formData,
				}
			)
				.then((res) => res.json())
				.then((data) => data.secure_url);
		});

		const uploadedUrls = await Promise.all(uploadPromises);
		setUrls(uploadedUrls);
	};

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">
				Upload Multiple Files to Cloudinary
			</h2>
			<div className="mb-4">
				<button
					onClick={() => document.getElementById("fileInput").click()}
					className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
				>
					+ Add File
				</button>
				<input
					id="fileInput"
					type="file"
					multiple
					onChange={handleFileChange}
					className="hidden"
				/>
			</div>

			<ul className="list-disc list-inside mb-4">
				{files.map((file, index) => (
					<li key={index}>{file.name}</li>
				))}
			</ul>

			<button
				onClick={uploadFiles}
				className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
			>
				Upload Files
			</button>

			{urls.length > 0 && (
				<div className="mt-4">
					<h3 className="text-lg font-semibold">Uploaded URLs:</h3>
					<ul className="list-disc list-inside">
						{urls.map((url, index) => (
							<li key={index}>
								<a
									href={url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 underline"
								>
									{url}
								</a>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default MultiFileUpload;

// Let me know if you want me to add file type icons, file size validation, or progress indicators! 🚀
