import React from "react";
import { useSelector } from "react-redux";
import PostsList from "../../../post/PostList";
import RightDetails from "../../../post/RightDetails";

const Feed = () => {
	const { posts } = useSelector((store) => store.post);

	return (
		<div className="flex justify-between p-4">
			{/* Posts List Section */}
			<div className="w-3/4">
				<PostsList />
			</div>

			{/* Right Sidebar (Additional Info) */}
			<div className="w-1/4">
				<RightDetails posts={posts} />
			</div>
		</div>
	);
};

export default Feed;
