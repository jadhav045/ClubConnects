import React from "react";
import useAllPosts from "../../hooks/useAllPosts";
import PostCard from "./PostCard";

const PostsList = () => {
	const posts = useAllPosts(); // Fetch posts using the custom hook

	return (
		<div className="container mx-auto p-4">
			<h2 className="text-xl font-bold mb-4">All Posts</h2>
			{posts?.length > 0 ? (
				posts?.map((post) => (
					<PostCard
						key={post._id}
						post={post}
					/>
				))
			) : (
				<p>Loading posts...</p>
			)}
		</div>
	);
};

export default PostsList;
