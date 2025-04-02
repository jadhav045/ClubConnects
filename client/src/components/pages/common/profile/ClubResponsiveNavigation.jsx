import React, { useState } from "react";

import PostCard from "../../../post/PostCard";
import { getPresidentClub, getUser } from "../../../../routes/apiConfig";
import DiscussionCard from "../../discuss/DiscussionCard";

import EventCard from "../../../sub-components/EventCard";
import { Users, UserPlus } from "lucide-react";

import { Card, CardContent } from "@mui/material";
import { Button } from "@mui/material";
import DialogComponent from "../../../common/DialogComponent";
// import DialogComponent from "./DialogComponent";/

export const ClubResponsiveNavigation = ({ club }) => {
	const currentUser = getUser();

	// console.log("SAVED PArti", club.saved);
	const [activeTab, setActiveTab] = useState("posts");

	return (
		<div className="p-4 bg-gray-50 min-h-screen">
			<div className="mb-6">
				<div className="flex gap-2 mt-4">
					{(getPresidentClub() != currentUser._id
						? ["posts", "events", "discussions"]
						: [
								"posts",
								"eventParticipated",
								"opportunities",
								"discussions",
								"saved",
						  ]
					) // Show all if they don't match
						.map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-4 py-2 rounded capitalize ${
									activeTab === tab
										? "bg-blue-600 text-white"
										: "bg-white border"
								}`}
							>
								{tab}
							</button>
						))}
				</div>
			</div>

			{activeTab === "posts" && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 className="font-medium mb-2">Post</h3>
						<div className="space-y-2">
							{club?.posts?.map((post) => (
								<PostCard
									post={post}
									currentUser={user}
								/>
							))}
						</div>
					</div>
				</div>
			)}

			{activeTab === "saved" && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 className="font-medium mb-2">Save</h3>
						<div className="space-y-2">
							{club?.saved?.map((post) => (
								<PostCard
									post={post}
									currentUser={user}
								/>
							))}
						</div>
					</div>
				</div>
			)}

			{activeTab === "events" && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 className="font-medium mb-2">Events Hosted</h3>
						<div className="space-y-2">
							{club?.events?.map((event) => (
								<EventCard
									event={event}
									userId={user._id}
								/>
							))}
						</div>
					</div>
				</div>
			)}
			{/* {activeTab === "opportunities" && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 className="font-medium mb-2">Opp</h3>
						<div className="space-y-2">
							{user.opportunities.map((opportunity) => (
								<OpportunityCard opportunity={opportunity} />
							))}
						</div>
					</div>
				</div>
			)} */}
			{activeTab === "discussions" && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 className="font-medium mb-2">Discussions</h3>
						<div className="space-y-2">
							{club?.discussions?.map((discussion, index) => (
								<DiscussionCard
									discussion={discussion}
									currentUser={currentUser}
								/>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export const ClubMembers = ({ members, followers }) => {
	const [open, setOpen] = useState(false);
	const [listType, setListType] = useState(null);

	const openList = (type) => {
		setListType(type);
		setOpen(true);
	};

	return (
		<div className="flex items-center gap-4 p-4">
			{[
				{
					type: "members",
					label: "Members",
					count: members.length,
					icon: Users,
				},
				{
					type: "followers",
					label: "Followers",
					count: followers.length,
					icon: UserPlus,
				},
			].map((item) => (
				<Card
					key={item.type}
					className="w-40 text-center p-3 cursor-pointer shadow-md hover:shadow-lg transition-all rounded-xl"
					onClick={() => openList(item.type)}
				>
					<CardContent className="flex flex-col items-center gap-2">
						<item.icon className="w-6 h-6 text-gray-600" />
						<h2 className="text-md font-semibold">{item.label}</h2>
						<p className="text-lg font-bold">{item.count}</p>
					</CardContent>
				</Card>
			))}

			<DialogComponent
				title={listType === "members" ? "Club Members" : "Followers"}
				open={open}
				onClose={() => setOpen(false)}
			>
				<ul className="p-4 space-y-2 text-sm">
					{(listType === "members" ? members : followers).map((item, index) => (
						<li
							key={index}
							className="flex items-center gap-3 p-2 border-b"
						>
							<img
								src={item.userId?.profilePicture || "/default-avatar.png"}
								alt="Profile"
								className="w-8 h-8 rounded-full object-cover"
							/>
							<div className="text-gray-700">
								<p className="font-medium">
									{item.userId?.fullName || "Unknown"}
								</p>
								{listType === "members" && (
									<p className="text-xs text-gray-500">{item.role}</p>
								)}
							</div>
						</li>
					))}
				</ul>
			</DialogComponent>
		</div>
	);
};
