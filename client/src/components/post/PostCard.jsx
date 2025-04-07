import React, { useEffect, useState } from "react";
import {
	FaEllipsisH,
	FaRegHeart,
	FaHeart,
	FaRegComment,
	FaRegPaperPlane,
	FaRegBookmark,
	FaBookmark,
	FaTrash,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { usePostCard } from "./postCardFn";
import CommentsModal from "./CommentsModal";

import { useNavigate } from "react-router-dom";
import { getUser } from "../../routes/apiConfig";

const PostCard = ({ post, currentUser }) => {
	// console.log("post", post);
	const [showComments, setShowComments] = useState(false);
	const {
		showOptions,
		likes,
		liked,
		comments,
		newComment,
		isSubmittingComment,
		replyingTo,
		replyText,
		isSubmittingReply,
		setNewComment,
		setReplyingTo,
		setReplyText,
		handleLike,
		toggleOptions,
		handleAddComment,
		handleDeleteComment,
		handleReply,

		handleDeleteReply,
		isSaved,
		handleSavePost,

		isDeleting,
		handleDeletePost,
	} = usePostCard(post, currentUser);

	const user = getUser();

	const navigate = useNavigate();

	const handleNavigate = () => {
		if (post?.authorId?._id) {
			navigate(`/${user.role}/profile/${post.authorId._id}`);
		}
	};

	return (
		<div className="bg-white max-w-[500px] w-full mx-auto mb-4 sm:rounded-lg overflow-hidden border border-gray-200 shadow-sm">
			{/* Header */}
			<div className="flex items-center justify-between p-2.5">
				<div className="flex items-center space-x-2">
					<button
						onClick={handleNavigate}
						className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition duration-200"
					>
						<img
							src={
								post?.authorId?.profilePicture ||
								"https://via.placeholder.com/40"
							}
							alt="Profile"
							className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
							onError={(e) => {
								e.target.src = "https://via.placeholder.com/40";
							}}
						/>

						<h4 className="text-sm font-semibold">
							{post?.authorId?.fullName}
						</h4>
					</button>
					<p className="text-xs text-gray-500">{post?.category}</p>
				</div>
				<div className="relative">
					<button
						onClick={toggleOptions}
						className="p-1.5 hover:bg-gray-100 rounded-full"
					>
						<FaEllipsisH className="text-gray-600 w-4 h-4" />
					</button>

					{showOptions && (
						<div className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md py-1 text-xs z-50 border border-gray-100">
							<button
								onClick={handleSavePost}
								className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
							>
								{isSaved ? (
									<FaBookmark className="text-blue-500 w-3.5 h-3.5" />
								) : (
									<FaRegBookmark className="w-3.5 h-3.5" />
								)}
								<span>{isSaved ? "Unsave" : "Save"}</span>
							</button>
							{(currentUser?._id === post?.authorId?._id ||
								currentUser?.role === "Admin") && (
								<button
									onClick={handleDeletePost}
									className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-500"
								>
									<FaTrash className="w-3.5 h-3.5" />
									<span>Delete</span>
								</button>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Media */}
			{post?.attachments?.length > 0 && (
				<div className="relative aspect-square bg-gray-50">
					<Swiper
						navigation
						pagination={{ clickable: true }}
						modules={[Navigation, Pagination]}
						className="h-full w-full"
					>
						{post.attachments.map((file, index) => (
							<SwiperSlide key={index}>
								{file.fileType === "mp4" ? (
									<video
										controls
										className="w-full h-full object-cover"
									>
										<source
											src={file.fileUrl}
											type="video/mp4"
										/>
									</video>
								) : (
									<img
										src={file.fileUrl}
										alt="Post content"
										className="w-full h-full object-cover"
										loading="lazy"
									/>
								)}
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			)}

			{/* Actions */}
			<div className="px-3 pt-3">
				<div className="flex justify-between items-center">
					<div className="flex space-x-3">
						<button
							onClick={handleLike}
							className={`${liked ? "text-red-500" : "text-gray-900"}`}
						>
							{liked ? (
								<FaHeart className="w-5 h-5" />
							) : (
								<FaRegHeart className="w-5 h-5" />
							)}
						</button>
						<button
							onClick={() => setShowComments(true)}
							className="text-gray-900"
						>
							<FaRegComment className="w-5 h-5" />
						</button>
						<button className="text-gray-900">
							<FaRegPaperPlane className="w-5 h-5" />
						</button>
					</div>
					<button onClick={handleSavePost}>
						{isSaved ? (
							<FaBookmark className="text-blue-500 w-5 h-5" />
						) : (
							<FaRegBookmark className="w-5 h-5" />
						)}
					</button>
				</div>

				{/* Likes and Text */}
				<div className="mt-2 space-y-1">
					<p className="text-sm font-semibold">{likes} likes</p>
					<div className="text-sm">
						<span className="font-semibold">{post?.authorId?.fullName}</span>
						<span className="ml-2">{post?.text}</span>
					</div>
					{post?.mentions?.length > 0 && (
						<div className="text-xs text-blue-600">
							{post.mentions.map((mention, index) => (
								<a
									key={index}
									href={`/@${mention}`}
									className="mr-1.5"
								>
									@{mention}
								</a>
							))}
						</div>
					)}
					<button
						onClick={() => setShowComments(true)}
						className="text-gray-500 text-xs"
					>
						View all {comments?.length} comments
					</button>
				</div>

				{/* Timestamp */}
				<p className="text-gray-500 text-xs uppercase mt-2 pb-2">
					{post?.createdAt}
				</p>
			</div>
			<CommentsModal
				isOpen={showComments}
				onClose={() => setShowComments(false)}
				post={post}
				comments={comments}
				currentUser={currentUser}
				newComment={newComment}
				setNewComment={setNewComment}
				handleAddComment={handleAddComment}
				handleDeleteComment={handleDeleteComment}
				handleReply={handleReply}
				replyingTo={replyingTo}
				setReplyingTo={setReplyingTo}
				replyText={replyText}
				setReplyText={setReplyText}
				isSubmittingComment={isSubmittingComment}
				isSubmittingReply={isSubmittingReply}
			/>
		</div>
	);
};

export default PostCard;
