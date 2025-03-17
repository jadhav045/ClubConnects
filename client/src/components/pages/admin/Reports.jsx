import React from "react";
import RequestComponent from "../../form/RequestComponent";

const requestData = {
	_id: "660b1c2a5f3a2e001c8a9b23",
	clubId: "660b1a9b5f3a2e001c8a9b20",
	requestType: "Event Approval",
	title: "Annual Tech Fest",
	description:
		"Request for approval to organize the Annual Tech Fest with multiple workshops and hackathons.",
	submittedBy: {
		_id: "660b1b5e5f3a2e001c8a9b21",
		name: "John Doe",
		email: "john.doe@example.com",
	},
	submissionDate: "2025-03-07T10:00:00Z",
	requestStatus: "Pending",
	attachments: [
		{
			fileName: "event_plan.pdf",
			fileUrl: "https://example.com/event_plan.pdf",
			uploadedAt: "2025-03-06T09:30:00Z",
		},
	],
	comments: [
		{
			commentBy: {
				_id: "660b1c5b5f3a2e001c8a9b24",
				name: "Jane Smith",
			},
			commentText: "Please add the event budget details.",
			timestamp: "2025-03-06T11:45:00Z",
		},
	],
	actionHistory: [
		{
			actionBy: {
				_id: "660b1c9d5f3a2e001c8a9b25",
				name: "Emily Johnson",
			},
			actionType: "Commented",
			actionDate: "2025-03-06T11:46:00Z",
		},
	],
};

const Reports = () => {
	return (
		<div>
			Here a admin can see all types of reports
			<RequestComponent requestData={requestData} />
		</div>
	);
};

export default Reports;
