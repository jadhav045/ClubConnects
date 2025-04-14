import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
import { API_URL, getToken } from "../routes/apiConfig";

const socketUrl = "http://localhost:3002";
export const useNotifications = () => {
	const [notifications, setNotifications] = useState([]);
	const user = useSelector((state) => state.auth.user);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const token = getToken();
				console.log("Get No");

				const res = await axios.get(`${API_URL}/auth/notifications`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				setNotifications(res.data);
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
		};

		fetchNotifications();

		const socket = io(socketUrl);
		socket.on("notification", (message) => {
			const newNotification = JSON.parse(message);
			console.log("From Notification", message);
			if (newNotification.to.includes(user._id)) {
				setNotifications((prev) => [newNotification, ...prev]);
			}
		});

		return () => {
			socket.disconnect();
		};
	}, [user]);

	const markNotificationAsRead = async (notificationId) => {
		try {
			const token = getToken();
			await axios.put(
				`${API_URL}/auth/${notificationId}/read`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setNotifications((prev) =>
				prev.map((notif) =>
					notif._id === notificationId ? { ...notif, isRead: true } : notif
				)
			);
		} catch (error) {
			console.error("Error marking notification as read:", error);
		}
	};

	return { notifications, markNotificationAsRead };
};
