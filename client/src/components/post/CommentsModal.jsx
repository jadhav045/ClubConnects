import React from "react";
import { FaTimes, FaReply } from "react-icons/fa";
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
		<div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
				{/* Header */}
				<div className="flex justify-between items-center p-4 border-b">
					<h3 className="text-lg font-semibold">
						Comments ({comments?.length})
					</h3>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						<FaTimes />
					</button>
				</div>

				{/* Comments List */}
				<div className="overflow-y-auto p-4 max-h-[calc(80vh-180px)]">
					{comments?.map((comment) => (
						<div
							key={comment._id}
							className="mb-4 border-b pb-2"
						>
							<div className="flex items-start gap-2">
								<img
									src={comment.userId?.profilePicture}
									alt="Profile"
									className="w-8 h-8 rounded-full"
								/>
								<div className="flex-1">
									<div className="bg-gray-50 rounded-lg p-3">
										<div className="flex justify-between items-start">
											<span className="font-medium text-sm">
												{comment.userId?.fullName}
											</span>
											<span className="text-xs text-gray-500">
												{formatDistanceToNow(new Date(comment.timestamp), {
													addSuffix: true,
												})}
											</span>
										</div>
										<p className="mt-1">{comment.text}</p>
									</div>

									{/* Comment Actions */}
									<div className="flex gap-4 mt-1 text-xs">
										<button
											onClick={() => setReplyingTo(comment._id)}
											className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
										>
											<FaReply /> Reply
										</button>
										{(currentUser?._id === comment.userId?._id ||
											currentUser?.role === "Admin") && (
											<button
												onClick={() => handleDeleteComment(comment._id)}
												className="text-red-500 hover:text-red-700"
											>
												Delete
											</button>
										)}
									</div>

									{/* Reply Input */}
									{replyingTo === comment._id && (
										<div className="mt-2 flex gap-2">
											<input
												type="text"
												value={replyText}
												onChange={(e) => setReplyText(e.target.value)}
												className="flex-1 text-sm p-2 border rounded-full"
												placeholder="Write a reply..."
											/>
											<button
												onClick={() => handleReply(comment._id)}
												disabled={isSubmittingReply}
												className="text-blue-500 hover:text-blue-700 text-sm"
											>
												Post
											</button>
										</div>
									)}

									{/* Replies */}
									{comment.replies?.length > 0 && (
										<div className="ml-8 mt-2 space-y-2">
											{comment.replies.map((reply) => (
												<div
													key={reply._id}
													className="flex gap-2"
												>
													<img
														src={reply.userId?.profilePicture}
														alt="Profile"
														className="w-6 h-6 rounded-full"
													/>
													<div className="flex-1 bg-gray-50 rounded-lg p-2">
														<div className="flex justify-between">
															<span className="font-medium text-xs">
																{reply.userId?.fullName}
															</span>
															<span className="text-xs text-gray-500">
																{formatDistanceToNow(
																	new Date(reply.timestamp),
																	{ addSuffix: true }
																)}
															</span>
														</div>
														<p className="text-xs mt-1">{reply.text}</p>
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
					<div className="flex items-center gap-2">
						<img
							src={currentUser?.profilePicture}
							alt="Profile"
							className="w-8 h-8 rounded-full"
						/>
						<input
							type="text"
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							className="flex-1 p-2 border rounded-full"
							placeholder="Write a comment..."
							onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
						/>
						<button
							onClick={handleAddComment}
							disabled={isSubmittingComment}
							className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
						>
							{isSubmittingComment ? "..." : "Post"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CommentsModal;
