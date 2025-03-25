import React from "react";
import {
	FaTimes,
	FaReply,
	FaRegComment,
	FaRegPaperPlane,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const CommentsModal = ({
	isOpen,
	onClose,
	post,
	comments,
	currentUser,
	newComment,
	setNewComment,
	handleAddComment,
	handleDeleteComment,
	handleReply,
	replyingTo,
	setReplyingTo,
	replyText,
	setReplyText,
	isSubmittingComment,
	isSubmittingReply,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0  bg-opacity-80 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="flex justify-between items-center p-4 border-b">
					<h3 className="text-lg font-semibold">Comments</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
					>
						<FaTimes className="text-xl" />
					</button>
				</div>

				{/* Comments List */}
				<div className="overflow-y-auto p-4 flex-1">
					{comments?.map((comment) => (
						<div
							key={comment._id}
							className="mb-4 group"
						>
							<div className="flex items-start gap-3">
								<img
									src={comment.userId?.profilePicture}
									alt="Profile"
									className="w-8 h-8 rounded-full object-cover"
								/>
								<div className="flex-1">
									<div className="flex items-baseline gap-2">
										<span className="font-semibold text-sm">
											{comment.userId?.fullName}
										</span>
										<span className="text-xs text-gray-500">
											{formatDistanceToNow(new Date(comment.timestamp), {
												addSuffix: true,
											})}
										</span>
									</div>
									<p className="text-sm mt-0.5">{comment.text}</p>

									{/* Comment Actions */}
									<div className="flex items-center gap-4 mt-1">
										<button
											onClick={() => setReplyingTo(comment._id)}
											className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
										>
											Reply
										</button>
										{(currentUser?._id === comment.userId?._id ||
											currentUser?.role === "Admin") && (
											<button
												onClick={() => handleDeleteComment(comment._id)}
												className="text-xs text-gray-500 hover:text-red-600"
											>
												Delete
											</button>
										)}
									</div>

									{/* Reply Input */}
									{replyingTo === comment._id && (
										<div className="mt-3 ml-4 flex items-center gap-2">
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
													className="w-full text-sm p-2 pr-16 border-b focus:outline-none focus:border-gray-500"
													placeholder="Add a reply..."
												/>
												<button
													onClick={() => handleReply(comment._id)}
													disabled={isSubmittingReply}
													className="absolute right-2 top-2 text-blue-500 hover:text-blue-600 text-sm font-semibold disabled:opacity-50"
												>
													Post
												</button>
											</div>
										</div>
									)}

									{/* Replies */}
									{comment.replies?.length > 0 && (
										<div className="ml-8 mt-3 space-y-3 border-l-2 border-gray-100 pl-4">
											{comment.replies.map((reply) => (
												<div
													key={reply._id}
													className="flex items-start gap-3"
												>
													<img
														src={reply.userId?.profilePicture}
														alt="Profile"
														className="w-6 h-6 rounded-full object-cover"
													/>
													<div className="flex-1">
														<div className="flex items-baseline gap-2">
															<span className="font-semibold text-sm">
																{reply.userId?.fullName}
															</span>
															<span className="text-xs text-gray-500">
																{formatDistanceToNow(
																	new Date(reply.timestamp),
																	{
																		addSuffix: true,
																	}
																)}
															</span>
														</div>
														<p className="text-sm mt-0.5">{reply.text}</p>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Comment Input */}
				<div className="border-t p-4 bg-white">
					<div className="flex items-center gap-3">
						<img
							src={currentUser?.profilePicture}
							alt="Profile"
							className="w-8 h-8 rounded-full object-cover"
						/>
						<div className="flex-1 relative">
							<input
								type="text"
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								className="w-full text-sm p-2 pr-16 border-b focus:outline-none focus:border-gray-500"
								placeholder="Add a comment..."
								onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
							/>
							<button
								onClick={handleAddComment}
								disabled={isSubmittingComment || !newComment}
								className="absolute right-2 top-2 text-blue-500 hover:text-blue-600 text-sm font-semibold disabled:opacity-50"
							>
								Post
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CommentsModal;
