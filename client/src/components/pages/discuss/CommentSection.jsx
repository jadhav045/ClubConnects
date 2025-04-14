import React, { useState, useEffect, useRef } from "react";
import { FaReply, FaTrash, FaRegPaperPlane, FaEllipsisV } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import axios from "axios";
import { Avatar } from "@mui/material";

const ActionMenu = ({ isVisible, onDelete, isAuthor }) => {
	const menuRef = useRef();

	console.log(isAuthor);
	if (!isVisible) return null;

	return (
		<div
			ref={menuRef}
			className="absolute right-0 top-0 mt-8 w-32 bg-white rounded-md shadow-lg py-1 z-[100] border border-gray-200" // Updated z-index and positioning
		>
			{isAuthor && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
					className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
				>
					<FaTrash className="w-3 h-3" />
					<span>Delete</span>
				</button>
			)}
		</div>
	);
};

const CommentSection = ({ discussionId, comments, currentUser }) => {
	const [newComment, setNewComment] = useState("");
	const [replyingTo, setReplyingTo] = useState(null);
	const [replyText, setReplyText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [activeMenu, setActiveMenu] = useState(null);

	const handleAddComment = async () => {
		if (!newComment.trim()) return;
		setIsLoading(true);
		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				`http://localhost:3002/discussions/${discussionId}/comment`,
				{ text: newComment },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				setNewComment("");
				toast.success("Comment added successfully");
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error(error.response?.data?.message || "Failed to add comment");
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddReply = async (commentId) => {
		if (!replyText.trim()) return;
		setIsLoading(true);
		try {
			const token = localStorage.getItem("token");
			const response = await axios.post(
				`http://localhost:3002/discussions/${discussionId}/comment/${commentId}/reply`,
				{ text: replyText },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				setReplyText("");
				setReplyingTo(null);
				toast.success("Reply added successfully");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to add reply");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteComment = async (commentId) => {
		if (!window.confirm("Are you sure you want to delete this comment?"))
			return;
		setIsLoading(true);
		try {
			const token = localStorage.getItem("token");
			const response = await axios.delete(
				`http://localhost:3002/discussions/${discussionId}/comment/${commentId}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				toast.success("Comment deleted successfully");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete comment");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteReply = async (commentId, replyId) => {
		if (!window.confirm("Are you sure you want to delete this reply?")) return;
		setIsLoading(true);
		try {
			const token = localStorage.getItem("token");
			const response = await axios.delete(
				`http://localhost:3002/discussions/${discussionId}/comment/${commentId}/reply/${replyId}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (response.data.success) {
				toast.success("Reply deleted successfully");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete reply");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="mt-4 space-y-4">
			{/* Add Comment Section */}
			<div className="flex items-start space-x-3">
				<Avatar
					src={currentUser?.profilePicture}
					alt="Profile"
					sx={{ width: 32, height: 32, cursor: "pointer" }}
				>
					{currentUser?.fullName?.charAt(0).toUpperCase()}
				</Avatar>
				<div className="flex-1 relative">
					<textarea
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						placeholder="Add a comment..."
						className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all resize-none"
						rows={1}
					/>
					<button
						onClick={handleAddComment}
						disabled={isLoading || !newComment.trim()}
						className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
					>
						<FaRegPaperPlane className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Comments List */}
			{comments?.map((comment) => (
				<div
					key={comment._id}
					className="group"
				>
					<div className="flex space-x-3">
						<img
							src={comment.userId?.profilePicture}
							alt="Profile"
							className="w-8 h-8 rounded-full object-cover"
						/>
						<div className="flex-1">
							<div className="bg-gray-50 rounded-lg px-4 py-2 relative">
								<div className="flex justify-between items-start">
									<span className="font-medium text-sm">
										{comment.userId?.fullName}
									</span>
									<div className="relative">
										{" "}
										{/* Added wrapper div */}
										<button
											onClick={() =>
												setActiveMenu(
													activeMenu === `comment-${comment._id}`
														? null
														: `comment-${comment._id}`
												)
											}
											className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 absolute z-50"
										>
											<FaEllipsisV className="w-3 h-3" />
										</button>
										<ActionMenu
											isVisible={activeMenu === `comment-${comment._id}`}
											onDelete={() => handleDeleteComment(comment._id)}
											isAuthor={
												currentUser?._id === comment.userId ||
												currentUser?.role === "Admin"
											}
										/>
									</div>
								</div>
								<p className="mt-1 text-gray-700">{comment.text}</p>
							</div>

							{/* Comment Actions */}
							<div className="flex items-center space-x-4 mt-1 px-2">
								<span className="text-xs text-gray-500">
									{formatDistanceToNow(new Date(comment.timestamp), {
										addSuffix: true,
									})}
								</span>
								<button
									onClick={() => setReplyingTo(comment._id)}
									className="text-xs text-gray-500 hover:text-blue-500 transition-colors flex items-center space-x-1"
								>
									<FaReply className="w-3 h-3" />
									<span>Reply</span>
								</button>
							</div>

							{/* Replies */}
							{comment.replies?.length > 0 && (
								<div className="mt-2 space-y-3">
									{comment.replies.map((reply) => (
										<div
											key={reply._id}
											className="flex space-x-3 ml-6 group"
										>
											<img
												src={reply.userId?.profilePicture}
												alt="Profile"
												className="w-6 h-6 rounded-full object-cover"
											/>
											<div className="flex-1">
												<div className="bg-gray-50 rounded-lg px-3 py-2 relative">
													<div className="flex justify-between items-start">
														<span className="font-medium text-xs">
															{reply.userId?.fullName}
														</span>
														<div className="relative">
															{" "}
															{/* Added wrapper div */}
															<button
																onClick={() =>
																	setActiveMenu(
																		activeMenu === `reply-${reply._id}`
																			? null
																			: `reply-${reply._id}`
																	)
																}
																className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200"
															>
																<FaEllipsisV className="w-3 h-3" />
															</button>
															<ActionMenu
																isVisible={activeMenu === `reply-${reply._id}`}
																onDelete={() =>
																	handleDeleteReply(comment._id, reply._id)
																}
																isAuthor={
																	currentUser?._id === reply.userId ||
																	currentUser?.role === "Admin"
																}
															/>
														</div>
													</div>
													<p className="mt-1 text-sm text-gray-700">
														{reply.text}
													</p>
												</div>
												<span className="text-xs text-gray-500 ml-2">
													{formatDistanceToNow(new Date(reply.timestamp), {
														addSuffix: true,
													})}
												</span>
											</div>
										</div>
									))}
								</div>
							)}

							{/* Reply Input */}
							{replyingTo === comment._id && (
								<div className="mt-2 ml-6 flex items-start space-x-3">
									<img
										src={currentUser?.profilePicture}
										alt="Profile"
										className="w-6 h-6 rounded-full object-cover"
									/>
									<div className="flex-1 relative">
										<input
											type="text"
											value={replyText}
											onChange={(e) => setReplyText(e.target.value)}
											placeholder="Write a reply..."
											className="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
										/>
										<button
											onClick={() => handleAddReply(comment._id)}
											disabled={isLoading || !replyText.trim()}
											className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:text-blue-600 disabled:opacity-50 transition-colors"
										>
											<FaRegPaperPlane className="w-3 h-3" />
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default CommentSection;
