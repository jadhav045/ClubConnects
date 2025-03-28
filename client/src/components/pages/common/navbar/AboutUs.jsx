// Example usage in a component
// import FileUpload from '../common/FileUpload';

import { FileUpload } from "@mui/icons-material";

const AboutUs = () => {
	const handleUploadSuccess = ({ url, publicId }) => {
		console.log("Upload successful!");
		console.log("URL:", url);
		console.log("Public ID:", publicId);
		// Do something with the URL and public ID
	};

	return (
		<div>
			<h2>Upload File</h2>
			<FileUpload onUploadSuccess={handleUploadSuccess} />
		</div>
	);
};

export default AboutUs;
