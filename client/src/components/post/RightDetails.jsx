import React from "react";

const RightDetails = ({ posts }) => {
	// Example: Finding the most trending post based on reactions
	const trendingPost = posts.reduce(
		(max, post) => {
			const totalReactions = Object.values(post.interactions.reactions).reduce(
				(a, b) => a + b,
				0
			);
			return totalReactions > (max.reactions || 0)
				? { ...post, reactions: totalReactions }
				: max;
		},
		{ reactions: 0 }
	);

	return (
		<div className="p-4 border-l border-gray-300">
			<h2 className="text-lg font-bold mb-2">Trending Post</h2>
			{trendingPost._id ? (
				<div className="p-2 border rounded shadow-sm bg-white">
					<strong>{trendingPost.author.role}</strong>
					<p className="text-sm text-gray-600">{trendingPost.content.text}</p>
					<p className="text-xs text-gray-500">
						🔥 {trendingPost.reactions} reactions
					</p>
				</div>
			) : (
				<p className="text-sm text-gray-500">No trending posts yet.</p>
			)}
		</div>
	);
};

export default RightDetails;
