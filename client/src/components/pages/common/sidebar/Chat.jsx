import React from "react";
import MultiFileUpload from "../../../../MultiFileUpload";
import ResponseViewer from "../../../form/ResponseVIewer";

const Chat = () => {
	return (
		<div>
			{/* <MultiFileUpload /> */}
			<ResponseViewer />
		</div>
	);
};

export default Chat;

// const [eventId, setEventId] = useState("");
// 	const [formType, setFormType] = useState("REGISTRATION");
// 	const [responses, setResponses] = useState([]);
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState("");

// 	// Calculate statistics
// 	const totalResponses = responses.length;
// 	const lastSubmission = responses[0]
// 		? new Date(responses[0].submittedAt).toLocaleDateString()
// 		: "N/A";
