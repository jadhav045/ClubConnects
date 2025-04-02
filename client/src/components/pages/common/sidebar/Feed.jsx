import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../../../post/PostCard";
import RightDetails from "../../../post/RightDetails";
import useAllPosts from "../../../../hooks/useAllPosts";
import CreatePost from "../../../post/CreatePost";
import Notifications from "../../../post/Notifications";
import { useSocket } from "../../../../config/socket";
// import CreatePost from "../../../post/CreatePost"; // Import your CreatePost component

const Feed = () => {
	const dispatch = useDispatch();
	const { posts, loading, error } = useSelector((store) => store.post);
	const { user } = useSelector((store) => store.auth);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handlePostDeleted = (postId) => {
		dispatch(removePost(postId));
	};

	const { notification } = useSocket();

	if (notification) {
		alert(notification);
	}
	useAllPosts();

	return (
		<div className="flex justify-between p-4 gap-4">
			{/* Left Section - Posts */}
			<div className="w-3/4 space-y-6">
				{/* Create Post Button */}
				<button
					onClick={() => setIsModalOpen(true)}
					className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
				>
					Create Post
				</button>

				{/* Posts List */}
				{loading ? (
					<div className="text-center">Loading posts...</div>
				) : error ? (
					<div className="text-red-500 text-center">{error}</div>
				) : posts?.length === 0 ? (
					<div className="text-center text-gray-500">No posts yet</div>
				) : (
					posts?.map((post) => (
						<PostCard
							key={post?._id}
							post={post}
							currentUser={user}
							onPostDeleted={handlePostDeleted}
						/>
					))
				)}
			</div>

			{/* Modal for CreatePost */}
			{isModalOpen && (
				<div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-90">
					<div className="bg-white p-6 rounded-lg shadow-lg w-1/2 relative">
						{/* Close Button */}
						<button
							onClick={() => setIsModalOpen(false)}
							className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
						>
							×
						</button>

						{/* CreatePost Component */}
						<CreatePost closeModal={() => setIsModalOpen(false)} />
					</div>
				</div>
			)}
		</div>
	);
};

export default Feed;
