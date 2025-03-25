import React from "react";
// import Post from "./Post";
import PostCard from "../../../post/PostCard";

const postData = {
	authorRole: "Student",
	text: "This is a sample post with images and a poll.",
	attachments: [
		{
			fileUrl: "https://via.placeholder.com/600x400.png",
			fileType: "jpg",
		},
		{
			fileUrl: "https://via.placeholder.com/600x400.png",
			fileType: "png",
		},
		{
			fileUrl:
				"https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
			fileType: "mp4",
		},
	],
	likes: ["user1", "user2"],
	comments: [
		{
			userId: "user1",
			text: "Great post!",
			timestamp: new Date("2024-03-19T12:00:00Z"),
			replies: [
				{
					userId: "user2",
					text: "I agree!",
					timestamp: new Date("2024-03-19T12:10:00Z"),
				},
			],
		},
		{
			userId: "user1",
			text: "Great post!",
			timestamp: new Date("2024-03-19T12:00:00Z"),
			replies: [
				{
					userId: "user2",
					text: "I agree!",
					timestamp: new Date("2024-03-19T12:10:00Z"),
				},
				{
					userId: "user2",
					text: "I agree!",
					timestamp: new Date("2024-03-19T12:10:00Z"),
				},
			],
		},
		{
			userId: "user1",
			text: "Great post!",
			timestamp: new Date("2024-03-19T12:00:00Z"),
			replies: [
				{
					userId: "user2",
					text: "I agree!",
					timestamp: new Date("2024-03-19T12:10:00Z"),
				},
			],
		},
		{
			userId: "user1",
			text: "Great post!",
			timestamp: new Date("2024-03-19T12:00:00Z"),
			replies: [
				{
					userId: "user2",
					text: "I agree!",
					timestamp: new Date("2024-03-19T12:10:00Z"),
				},
			],
		},
	],
};

const Clubs = () => {
	return (
		<div className="app-container">
			<PostCard
				post={postData}
				isAuthor={true}
			/>
		</div>
	);
};

export default Clubs;
