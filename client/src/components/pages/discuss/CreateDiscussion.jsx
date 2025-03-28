import { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";

import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addDiscussion } from "../../../store/slice/discussSlice";

const DISCUSSION_CATEGORIES = [
	"Interview Experience",
	"Roadmap",
	"Career",
	"Q&A",
	"Events",
	"Project Showcase",
	"Hackathons",
	"General Advice",
	"Placement",
];
const CreateDiscussion = ({ fetchDiscussions, onClose }) => {
	const editor = useRef(null);
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState(DISCUSSION_CATEGORIES[0]);
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();
	const handlePost = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			const response = await axios.post(
				"http://localhost:3002/discussions",
				{ title, description: content, category },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			dispatch(addDiscussion(response.data.discussion));
			toast.success("Discussion posted successfully!");
			onClose();
		} catch (error) {
			toast.error("Failed to post discussion");
			console.error("Error posting discussion:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
			<div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
				<h2 className="text-lg font-bold mb-4">Create a New Discussion</h2>
				<input
					type="text"
					placeholder="Enter Discussion Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-full p-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-500"
				/>
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className="w-full p-2 border rounded-md mb-2 focus:ring-2 focus:ring-blue-500"
				>
					{DISCUSSION_CATEGORIES.map((cat) => (
						<option
							key={cat}
							value={cat}
						>
							{cat}
						</option>
					))}
				</select>
				<JoditEditor
					ref={editor}
					value={content}
					onChange={setContent}
				/>
				<div className="mt-4 flex justify-end space-x-2">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handlePost}
						disabled={loading}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
					>
						{loading ? "Posting..." : "Post"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateDiscussion;
