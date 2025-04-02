import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

// Get the socket server URL from environment variables
const socketUrl = "http://localhost:3002"; // Adjust the URL based on your server

export const useSocket = () => {
	const [notifications, setNotifications] = useState([]); // Store multiple notifications
	const user = useSelector((state) => state.auth.user);
	console.log(user);

	useEffect(() => {
		// Establish socket connection
		const socketConnection = io(socketUrl);

		// Listen for notification events from the server
		socketConnection.on("notification", (message) => {
			message = JSON.parse(message);
			console.log(message.to);
			console.log(user._id);

			console.log("this this msg from server: ", message.message);
			if (message.to.includes(user._id)) {
				alert(message.message);
				setNotifications((prevNotifications) => [
					...prevNotifications,
					message, // Add the new notification to the list
				]);
			}
		});
		
		// Clean up the socket connection when the component unmounts
		return () => {
			socketConnection.disconnect();
		};
	}, []); // Empty dependency array ensures this only runs once on mount

	return { notifications };
};
