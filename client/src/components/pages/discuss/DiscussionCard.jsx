import React from "react";
import {
	FaComment,
	FaTrash,
	FaEdit,
	FaChevronDown,
	FaChevronUp,
} from "react-icons/fa";

import { PiHandsClappingFill, PiHandsClappingLight } from "react-icons/pi";

import { useNavigate } from "react-router-dom";
import HTMLReactParser from "html-react-parser";
import { formatDistanceToNow } from "date-fns";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DialogComponent from "../../common/DialogComponent";
import { Button, Tooltip } from "@mui/material";
import { useDiscussion } from "./DiscussionCardFn";
import CommentSection from "./CommentSection";

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

const truncateHTML = (html, maxLength) => {
	const div = document.createElement("div");
	div.innerHTML = html;
	const text = div.textContent;
	if (text.length <= maxLength) return html;
	return text.slice(0, maxLength).trim() + "...";
};
const AppreciationButton = ({ hasAppreciated, count, isLoading, onClick }) => {
	return (
		<Tooltip
			title={hasAppreciated ? "Remove appreciation" : "Show appreciation"}
		>
			<button
				onClick={onClick}
				disabled={isLoading}
				className={`flex items-center space-x-2 transition-all duration-300 group
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}
          px-3 py-1.5 rounded-lg`}
			>
				<div className="transition-transform duration-200 group-hover:scale-110">
					{hasAppreciated ? (
						<PiHandsClappingLight className="text-amber-600 animate-[bounce_0.6s_ease-in-out]" />
					) : (
						<PiHandsClappingFill className="text-gray-600" />
					)}
				</div>
				<span
					className={`text-sm font-medium 
          ${hasAppreciated ? "text-red-600" : "text-gray-600"}
          ${isLoading ? "animate-pulse" : ""}`}
				>
					{count || 0}
				</span>
			</button>
		</Tooltip>
	);
};

const DiscussionCard = ({ discussion, currentUser }) => {
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
	} = useDiscussion(discussion, currentUser);

	const navigate = useNavigate();
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

	const handleNavigate = () => {
		if (discussion?.createdBy?._id) {
			navigate(`/${currentUser.role}/profile/${discussion?.createdBy?._id}`);
		}
	};

	return (
		<article className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 mb-6">
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

			{/* Card Header */}
			<header className="flex justify-between items-start mb-4">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						{discussion.title}
					</h2>
					<div
						className="flex items-center space-x-3 cursor-pointer"
						onClick={handleNavigate}
					>
						<span className="inline-flex items-center text-sm font-medium text-gray-600">
							<span className="mr-2">👤</span>
							{discussion.createdBy?.fullName || "WHo"}
						</span>
						<span className="text-gray-400">•</span>
						<time className="text-sm text-gray-500">
							{formatDistanceToNow(new Date(discussion.createdAt), {
								addSuffix: true,
							})}
						</time>
					</div>
				</div>

				{(currentUser?._id === discussion.createdBy._id ||
					currentUser?.role === "Admin") && (
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

			{/* Card Content */}
			<div className="relative">
				<div
					className="prose max-w-none mb-4 text-gray-700 overflow-hidden relative"
					style={{ height: "140px" }}
				>
					{HTMLReactParser(discussion.description)}
					{/* Gradient overlay */}
					<div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
				</div>
				<button
					onClick={() =>
						navigate(`/${currentUser.role}/discussions/${discussion._id}`)
					}
					className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 group font-medium text-sm cursor-pointer relative z-10"
				>
					See full discussion
					<svg
						className="w-4 h-4 transition-transform group-hover:translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			</div>

			{/* Card Footer */}
			<footer className="pt-4 border-t border-gray-100 mt-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<AppreciationButton
							hasAppreciated={hasAppreciated}
							count={discussion.appreciations?.length}
							isLoading={isLoading}
							onClick={handleAppreciate}
						/>

						<button
							onClick={() => setShowComments(!showComments)}
							className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
						>
							<FaComment
								className="text-gray-600"
								size={18}
							/>
							<span className="text-sm font-medium text-gray-600">
								{discussion.comments?.length || 0}
							</span>
							<span className="text-gray-400 ml-1">
								{showComments ? (
									<FaChevronUp size={14} />
								) : (
									<FaChevronDown size={14} />
								)}
							</span>
						</button>
					</div>

					<span
						className={`px-3 py-1 rounded-full text-sm font-medium ${
							CATEGORY_COLORS[discussion.category] ||
							"bg-gray-100 text-gray-800"
						}`}
					>
						{discussion.category}
					</span>
				</div>

				{/* Comments Section */}
				{showComments && (
					<div className="mt-6">
						<CommentSection
							discussionId={discussion._id}
							comments={discussion.comments}
							currentUser={currentUser}
						/>
					</div>
				)}
			</footer>
		</article>
	);
};

export default DiscussionCard;
