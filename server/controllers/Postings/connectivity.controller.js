import { User } from "../../models/User.Model.js";

export const followUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const currentUser = req.user.id;

		if (currentUser === userId) {
			return res.status(400).json({ message: "You cannot follow yourself!" });
		}

		const userToFollow = await User.findById(userId);
		const currentUserData = await User.findById(currentUser);

		if (!userToFollow || !currentUserData) {
			return res.status(404).json({ message: "User not found!" });
		}
		console.log("wehere");

		if (!userToFollow.followers.includes(currentUser)) {
			userToFollow.followers.push(currentUser);
			currentUserData.following.push(userId);

			await userToFollow.save();
			await currentUserData.save();
			return res.json({ message: "Followed successfully", success: true });
		} else {
			return res
				.status(400)
				.json({ message: "Already following", success: true });
		}
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

export const unfollowUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const currentUser = req.user.id;

		const userToUnfollow = await User.findById(userId);
		const currentUserData = await User.findById(currentUser);

		if (!userToUnfollow || !currentUserData) {
			return res.status(404).json({ message: "User not found!" });
		}

		userToUnfollow.followers = userToUnfollow.followers.filter(
			(id) => id.toString() !== currentUser
		);
		currentUserData.following = currentUserData.following.filter(
			(id) => id.toString() !== userId
		);

		await userToUnfollow.save();
		await currentUserData.save();

		res.json({ message: "Unfollowed successfully", success: true });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};
export const sendConnection = async (req, res) => {
	try {
		const { userId } = req.params;
		const currentUser = req.user.id;

		if (currentUser === userId) {
			return res
				.status(400)
				.json({ message: "You cannot connect with yourself!" });
		}

		const recipient = await User.findById(userId);
		if (!recipient) {
			return res.status(404).json({ message: "User not found!" });
		}

		const existingRequest = recipient.connectionRequests.find(
			(req) => req.sender.toString() === currentUser
		);
		if (existingRequest) {
			return res
				.status(400)
				.json({ message: "Connection request already sent!" });
		}

		recipient.connectionRequests.push({ sender: currentUser });
		await recipient.save();

		res.json({ message: "Connection request sent!", success: true });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};
export const acceptConnection = async (req, res) => {
	try {
		const { requestId } = req.params;
		const currentUser = req.user.id;

		const currentUserData = await User.findById(currentUser);
		const requestIndex = currentUserData.connectionRequests.findIndex(
			(req) => req._id.toString() === requestId
		);

		if (requestIndex === -1) {
			return res.status(404).json({ message: "Connection request not found!" });
		}

		const senderId = currentUserData.connectionRequests[requestIndex].sender;

		currentUserData.connections.push(senderId);
		await currentUserData.save();

		const sender = await User.findById(senderId);
		sender.connections.push(currentUser);
		await sender.save();

		currentUserData.connectionRequests.splice(requestIndex, 1);
		await currentUserData.save();

		res.json({ message: "Connection accepted!", success: true });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

export const cancelConnection = async (req, res) => {
	try {
		const { requestId } = req.params;
		const currentUser = req.user.id;

		const recipient = await User.findOne({
			"connectionRequests._id": requestId,
		});

		if (!recipient) {
			return res.status(404).json({ message: "Request not found!" });
		}

		recipient.connectionRequests = recipient.connectionRequests.filter(
			(req) => req._id.toString() !== requestId
		);
		await recipient.save();

		res.json({ message: "Connection request canceled!", success: true });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};
