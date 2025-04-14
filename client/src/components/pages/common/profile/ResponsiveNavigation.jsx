import React, { useState } from "react";
import { useSelector } from "react-redux";
import PostCard from "../../../post/PostCard";
import { getUser } from "../../../../routes/apiConfig";
import DiscussionCard from "../../discuss/DiscussionCard";
import OpportunityCard from "../../opportunity/OpportunityCard";
import EventCard from "../../../sub-components/EventCard";

export const ResponsiveNavigation = ({ user }) => {
	const currentUser = getUser();

	console.log("SAVED PArti", user?.saved);
	const [activeTab, setActiveTab] = useState("posts");

	const isCurrentUser = user?._id === currentUser?._id;

	const tabs = isCurrentUser
		? ["posts", "eventParticipated", "opportunities", "discussions", "saved"]
		: ["posts", "discussions"];

	return (
		<div className="p-4 bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="mb-6">
				<div className="flex gap-2 mt-4">
					{tabs.map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-4 py-2 rounded capitalize ${
								activeTab === tab ? "bg-blue-600 text-white" : "bg-white border"
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
							{user?.posts?.map((post) => (
								<PostCard
									key={post?._id}
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
						<h3 className="font-medium mb-2">Saved</h3>
						<div className="space-y-2">
							{user?.saved?.map((post) => (
								<PostCard
									key={post?._id}
									post={post}
									currentUser={user}
								/>
							))}
						</div>
					</div>
				</div>
			)}

			{activeTab === "eventParticipated" && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 className="font-medium mb-2">Events Participated</h3>
						<div className="space-y-2">
							{user?.eventParticipated?.map((event) => (
								<EventCard
									key={event?._id}
									event={event}
									userId={user?._id}
								/>
							))}
						</div>
					</div>
				</div>
			)}

			{activeTab === "opportunities" && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 className="font-medium mb-2">Opportunities</h3>
						<div className="space-y-2">
							{user?.opportunities?.map((opportunity) => (
								<OpportunityCard
									key={opportunity?._id}
									opportunity={opportunity}
								/>
							))}
						</div>
					</div>
				</div>
			)}

			{activeTab === "discussions" && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<h3 className="font-medium mb-2">Discussions</h3>
						<div className="space-y-2">
							{user?.discussions?.map((discussion, index) => (
								<DiscussionCard
									key={discussion?._id || index}
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
