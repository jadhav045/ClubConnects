import { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { FiX, FiChevronDown, FiPlus, FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addDiscussion } from "../../../store/slice/discussSlice";
import { connect } from "mongoose";

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

const CreateDiscussion = ({ onClose }) => {
	const editor = useRef(null);
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState(DISCUSSION_CATEGORIES[0]);
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const handleContentChange = (newContent) => {
		setContent(newContent);
	};

	const handlePost = async () => {
		if (!title.trim()) {
			toast.error("Please enter a title");
			return;
		}

		if (!content.trim()) {
			toast.error("Please enter some content");
			return;
		}
		try {
			console.log("content", content);
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
		<div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
			<div className="bg-white rounded-xl shadow-lg w-full max-w-2xl border border-gray-100 flex flex-col max-h-[90vh]">
				{/* Header - Fixed */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">
						New Discussion
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
					>
						<FiX className="w-5 h-5" />
					</button>
				</div>

				{/* Content - Scrollable */}
				<div className="p-6 space-y-6 overflow-y-auto flex-1">
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Title</label>
						<input
							type="text"
							placeholder="Enter discussion title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 transition-all"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">
							Category
						</label>
						<div className="relative">
							<select
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
							<FiChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Content</label>
						<div className="min-h-[200px] max-h-[400px] overflow-y-auto">
							<JoditEditor
								ref={editor}
								value={content}
								config={{
									readonly: false,
									height: "400px",
									enableDragAndDropFileToEditor: true,
									buttons: [
										"bold",
										"italic",
										"underline",
										"|",
										"ul",
										"ol",
										"|",
										"link",
										"unlink",
										"|",
										"undo",
										"redo",
										"|",
										"source",
										],
									uploader: {
										insertImageAsBase64URI: true
									},
									removeButtons: ['fullsize', 'about'],
									showXPathInStatusbar: false,
									showCharsCounter: false,
									showWordsCounter: false,
									toolbarAdaptive: false
								}}
								onBlur={handleContentChange}
								onChange={handleContentChange}
								className="rounded-lg border border-gray-200 overflow-hidden"
							/>
						</div>
					</div>
				</div>

				{/* Footer - Fixed */}
				<div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-white">
					<button
						onClick={onClose}
						className="px-5 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={handlePost}
						disabled={loading}
						className="px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? (
							<>
								<FiLoader className="w-4 h-4 animate-spin" />
								Posting...
							</>
						) : (
							<>
								<FiPlus className="w-4 h-4" />
								Post Discussion
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateDiscussion;
