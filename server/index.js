import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.Route.js";
import adminRoutes from "./routes/role/admin.routes.js";
import facultyRoutes from "./routes/role/faculty.routes.js";
import studentRoutes from "./routes/role/student.routes.js";
import formRoutes from "./controllers/form.controller.js";
import eventRoutes from "./routes/eventRoutes.js";
import opportunityRoutes from "./routes/activities/opportunityRoutes.js";
import postRoutes from "./routes/activities/postRoutes.js";
import discussionRoutes from "./routes/activities/discussionsRoutes.js";
import connectionsRoutes from "./routes/activities/connectivityRoutes.js";
import { startEventScheduler } from "./middlewares/startEventSchedular.js";
import reportRoutes from "./routes/activities/eventReportRoute.js";
import fileRoutes from "./models/Chat/File.controller.js";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import upload from "./middlewares/multer.js";
import cloudinary from "./utils/cloudinary.js";
import sharp from "sharp";
import { Readable } from "stream";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/faculty", facultyRoutes);
app.use("/student", studentRoutes);
app.use("/event", eventRoutes);
app.use("/form", formRoutes);
app.use("/opportunities", opportunityRoutes);
app.use("/post", postRoutes);
app.use("/discussions", discussionRoutes);
app.use("/connections", connectionsRoutes);
app.use("/report", reportRoutes);
app.use("/file", fileRoutes);
// Start event scheduler
startEventScheduler();

// Database Connection
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log("DB Connection Error:", err));

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

// Create HTTP Server

io.on("connection", (socket) => {
	console.log("a user connected");
	// io.emit("notification", "you are connected to socket");
	io.emit("message1", "You ate ");
	// Listen for custom events
	socket.on("sendMessage", (message) => {
		console.log("Received message: ", message);

		// Emit the message to all connected clients
		io.emit("receiveMessage", message);
	});

	// Handle disconnection
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export { io };
