import { createClient } from "redis";

const redisClient = createClient({
	url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
await redisClient.connect();

export const storeUserSocket = async (userId, socketId) => {
	await redisClient.set(`socket:${userId}`, socketId);
};

export const removeUserSocket = async (userId) => {
	await redisClient.del(`socket:${userId}`);
};

export const getUserSocket = async (userId) => {
	return await redisClient.get(`socket:${userId}`);
};

export const clearUserSocketMap = () => {
	userSocketMap.clear();
	console.log("All users removed from userSocketMap.");
};
