import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../../../post/PostCard";
import RightDetails from "../../../post/RightDetails";
import useAllClubs from "../../../../hooks/useAllClubs";
import useAllPosts from "../../../../hooks/useAllPosts";

const Feed = () => {
	const dispatch = useDispatch();
	const { posts, loading, error } = useSelector((store) => store.post);
	const { user } = useSelector((store) => store.auth);

	const handlePostDeleted = (postId) => {
		console.log("We h");
		dispatch(removePost(postId));
	};

	useAllPosts();
	return (
		<div className="flex justify-between p-4 gap-4">
			{/* Posts List Section */}
			<div className="w-3/4 space-y-6">
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
		</div>
	);
};

export default Feed;
