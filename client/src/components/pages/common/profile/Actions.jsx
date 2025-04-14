import React, { useEffect, useState } from "react";
import {
	followUser,
	unfollowUser,
	sendConnectionRequest,
	acceptConnectionRequest,
	cancelConnectionRequest,
} from "./userActions";
import { useSelector } from "react-redux";

const Actions = ({ userId }) => {
	const { user: currentUser } = useSelector((store) => store.auth);
	const [profileData, setProfileData] = useState({
		isFollowing: false,
		isConnected: false,
		followersCount: 0,
		followingCount: 0,
		connectionsCount: 0,
		connectionStatus: null, // 'connected', 'pending-sent', 'pending-received'
	});

	useEffect(() => {
		// Simulated API call to get user profile data
		const fetchProfileData = async () => {
			try {
				// In real app, you would fetch this data from the backend
				const userProfile = {
					followers: currentUser.followers,
					following: currentUser.following,
					connections: currentUser.connections,
					connectionRequests: currentUser.connectionRequests,
				};

				setProfileData({
					isFollowing: userProfile.following.includes(userId),
					followersCount: userProfile.followers.length,
					followingCount: userProfile.following.length,
					connectionsCount: userProfile.connections.length,
					connectionStatus: getConnectionStatus(userProfile, userId),
				});
			} catch (error) {
				console.error("Error fetching profile data:", error);
			}
		};

		fetchProfileData();
	}, [userId, currentUser]);

	const getConnectionStatus = (profile, targetId) => {
		if (profile.connections.includes(targetId)) return "connected";
		const sentRequest = profile.sentRequests?.some(
			(req) => req.receiver === targetId
		);
		if (sentRequest) return "pending-sent";
		const receivedRequest = profile.receivedRequests?.some(
			(req) => req.sender === targetId
		);
		if (receivedRequest) return "pending-received";
		return null;
	};

	const handleFollow = async () => {
		try {
			if (profileData.isFollowing) {
				await unfollowUser(userId);
				setProfileData((prev) => ({
					...prev,
					isFollowing: false,
					followersCount: prev.followersCount - 1,
				}));
			} else {
				await followUser(userId);
				setProfileData((prev) => ({
					...prev,
					isFollowing: true,
					followersCount: prev.followersCount + 1,
				}));
			}
		} catch (error) {
			console.error("Error handling follow/unfollow:", error);
		}
	};

	const handleConnectionAction = async () => {
		try {
			switch (profileData.connectionStatus) {
				case "pending-sent":
					await cancelConnectionRequest(userId);
					setProfileData((prev) => ({ ...prev, connectionStatus: null }));
					break;
				case "pending-received":
					await acceptConnectionRequest(userId);
					setProfileData((prev) => ({
						...prev,
						connectionStatus: "connected",
						connectionsCount: prev.connectionsCount + 1,
					}));
					break;
				default:
					await sendConnectionRequest(userId);
					setProfileData((prev) => ({
						...prev,
						connectionStatus: "pending-sent",
					}));
			}
		} catch (error) {
			console.error("Connection action failed:", error);
		}
	};

	return (
		<div className="space-y-4 p-4 border rounded-lg">
			{/* Statistics Row */}
			<div className="flex justify-around text-center">
				<div>
					<p className="font-bold">{profileData.followersCount}</p>
					<p className="text-sm text-gray-600">Followers</p>
				</div>
				<div>
					<p className="font-bold">{profileData.followingCount}</p>
					<p className="text-sm text-gray-600">Following</p>
				</div>
				<div>
					<p className="font-bold">{profileData.connectionsCount}</p>
					<p className="text-sm text-gray-600">Connections</p>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-2">
				<button
					onClick={handleFollow}
					className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
						profileData.isFollowing
							? "bg-red-500 hover:bg-red-600"
							: "bg-blue-500 hover:bg-blue-600"
					} text-white`}
				>
					{profileData.isFollowing ? "Unfollow" : "Follow"}
				</button>

				{profileData.connectionStatus !== "connected" && (
					<button
						onClick={handleConnectionAction}
						className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
							profileData.connectionStatus === "pending-sent"
								? "bg-gray-500 hover:bg-gray-600"
								: profileData.connectionStatus === "pending-received"
								? "bg-green-500 hover:bg-green-600"
								: "bg-purple-500 hover:bg-purple-600"
						} text-white`}
					>
						{profileData.connectionStatus === "pending-sent"
							? "Cancel Request"
							: profileData.connectionStatus === "pending-received"
							? "Accept Connection"
							: "Connect"}
					</button>
				)}
			</div>

			{/* Connection Status */}
			{profileData.connectionStatus === "connected" && (
				<div className="text-center text-green-600 font-medium">
					✓ Connected
				</div>
			)}
		</div>
	);
};

export default Actions;
