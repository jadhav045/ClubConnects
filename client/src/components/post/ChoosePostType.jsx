import React, { useState } from "react";
import CreatePost from "./CreatePost";
import CreatePoll from "./CreatePoll";

const ChoosePostType = () => {
	const [postType, setPostType] = useState(null);

	return (
		<div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
			{!postType ? (
				// Show selection buttons
				<div className="text-center">
					<h2 className="text-xl font-bold mb-4">
						What would you like to create?
					</h2>
					<button
						onClick={() => setPostType("post")}
						className="w-full bg-blue-500 text-white py-2 rounded-lg mb-3 hover:bg-blue-600"
					>
						📝 Create a Post
					</button>
					<button
						onClick={() => setPostType("poll")}
						className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
					>
						📊 Create a Poll
					</button>
				</div>
			) : (
				// Show respective component based on selection
				<div>
					<button
						onClick={() => setPostType(null)}
						className="mb-3 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300"
					>
						⬅ Back
					</button>
					{postType === "post" ? <CreatePost /> : <CreatePoll />}
				</div>
			)}
		</div>
	);
};

export default ChoosePostType;
