import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import HTMLReactParser from "html-react-parser";
import { FaArrowLeft, FaComment, FaEdit, FaTrash } from "react-icons/fa";
import { PiHandsClappingFill, PiHandsClappingLight } from "react-icons/pi";
import { Button, Tooltip } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DialogComponent from "../../common/DialogComponent";
import CommentSection from "./CommentSection";
import { useDiscussion } from "./DiscussionCardFn";

const CATEGORY_COLORS = {
	"Interview Experience": "bg-blue-100 text-blue-800",
	Roadmap: "bg-purple-100 text-purple-800",
	Career: "bg-green-100 text-green-800",
	"Q&A": "bg-yellow-100 text-yellow-800",
	Events: "bg-pink-100 text-pink-800",
	"Project Showcase": "bg-indigo-100 text-indigo-800",
	Hackathons: "bg-red-100 text-red-800",
	"General Advice": "bg-gray-100 text-gray-800",
	Placement: "bg-teal-100 text-teal-800",
};

const DiscussionDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useSelector((store) => store.auth);
	const discussion = useSelector((state) =>
		state.discuss.discusss.find((d) => d._id === id)
	);

	const {
		isLoading,
		isEditing,
		setIsEditing,
		editedTitle,
		setEditedTitle,
		editedDescription,
		setEditedDescription,
		handleUpdate,
		handleDelete,
		handleAppreciate,
		showComments,
		setShowComments,
		hasAppreciated,
	} = useDiscussion(discussion, user);

	if (!discussion) {
		return (
			<div className="max-w-4xl mx-auto p-8">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Discussion not found
					</h2>
					<button
						onClick={() => navigate(-1)}
						className="text-blue-500 hover:text-blue-600 flex items-center gap-2 mx-auto"
					>
						<FaArrowLeft /> Go back
					</button>
				</div>
			</div>
		);
	}

	const dialogActions = (
		<div className="flex justify-end gap-3 mt-4">
			<Button
				onClick={() => setIsEditing(false)}
				variant="outlined"
				color="inherit"
			>
				Cancel
			</Button>
			<Button
				onClick={handleUpdate}
				variant="contained"
				color="primary"
				startIcon={<FaEdit />}
			>
				Update Post
			</Button>
		</div>
	);

	return (
		<div className="max-w-4xl mx-auto p-4 md:p-8">
			<button
				onClick={() => navigate(-1)}
				className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
			>
				<FaArrowLeft /> Back to discussions
			</button>

			<article className="bg-white rounded-xl shadow-lg p-6 md:p-8">
				<DialogComponent
					open={isEditing}
					onClose={() => setIsEditing(false)}
					title="Edit Discussion"
					actions={dialogActions}
				>
					<div className="space-y-6 pt-2">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Title
							</label>
							<input
								type="text"
								value={editedTitle}
								onChange={(e) => setEditedTitle(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter a meaningful title..."
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Content
							</label>
							<ReactQuill
								value={editedDescription}
								onChange={setEditedDescription}
								className="bg-white rounded-lg border border-gray-300 focus:border-blue-500"
								modules={{
									toolbar: [
										[{ header: [1, 2, 3, false] }],
										["bold", "italic", "underline", "strike"],
										[{ list: "ordered" }, { list: "bullet" }],
										["link", "code-block"],
										["clean"],
									],
								}}
								theme="snow"
								placeholder="Express your thoughts..."
							/>
						</div>
					</div>
				</DialogComponent>

				<header className="mb-8 flex justify-between items-start">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-4">
							{discussion.title}
						</h1>
						<div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
							<span className="inline-flex items-center font-medium">
								<span className="mr-2">👤</span>
								{discussion.createdBy?.fullName}
							</span>
							<span className="text-gray-400">•</span>
							<time>
								{formatDistanceToNow(new Date(discussion.createdAt), {
									addSuffix: true,
								})}
							</time>
							<span className="text-gray-400">•</span>
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium 
                ${
									CATEGORY_COLORS[discussion.category] ||
									"bg-gray-100 text-gray-800"
								}`}
							>
								{discussion.category}
							</span>
						</div>
					</div>

					{(user?._id === discussion.createdBy._id ||
						user?.role === "Admin") && (
						<div className="flex gap-2">
							<Tooltip title="Edit post">
								<button
									onClick={() => setIsEditing(true)}
									className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<FaEdit size={18} />
								</button>
							</Tooltip>
							<Tooltip title="Delete post">
								<button
									onClick={handleDelete}
									className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
								>
									<FaTrash size={18} />
								</button>
							</Tooltip>
						</div>
					)}
				</header>

				<div className="prose max-w-none mb-8">
					{HTMLReactParser(discussion.description)}
				</div>

				<footer className="border-t pt-6">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-4">
							<button
								onClick={handleAppreciate}
								disabled={isLoading}
								className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                  ${hasAppreciated ? "bg-amber-50" : "hover:bg-gray-50"}`}
							>
								{hasAppreciated ? (
									<PiHandsClappingLight className="text-amber-600 text-xl animate-bounce" />
								) : (
									<PiHandsClappingFill className="text-gray-600 text-xl" />
								)}
								<span
									className={`font-medium ${
										hasAppreciated ? "text-amber-600" : "text-gray-600"
									}`}
								>
									{discussion.appreciations?.length || 0} appreciations
								</span>
							</button>

							<button
								onClick={() => setShowComments(!showComments)}
								className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
							>
								<FaComment className="text-gray-600" />
								<span className="font-medium text-gray-600">
									{discussion.comments?.length || 0} comments
								</span>
							</button>
						</div>
					</div>

					{showComments && (
						<CommentSection
							discussionId={discussion._id}
							comments={discussion.comments}
							currentUser={user}
						/>
					)}
				</footer>
			</article>
		</div>
	);
};

export default DiscussionDetails;
