import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const socketUrl = "http://localhost:3002";
export const useSocket = () => {
	const [notifications, setNotifications] = useState([]);
	const user = useSelector((state) => state.auth.user);
	console.log(user);

	useEffect(() => {
		const socketConnection = io(socketUrl);

		socketConnection.on("notification", (message) => {
			message = JSON.parse(message);
			// console.log(message.to);
			// console.log(user._id);

			// console.log("this this msg from server: ", message.message);
			if (message.to.includes(user._id)) {
				alert(message.message);
				setNotifications((prevNotifications) => [
					...prevNotifications,
					message,
				]);
			}
		});

		return () => {
			socketConnection.disconnect();
		};
	}, []);

	return { notifications };
};
