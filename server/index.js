import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors"; // Add CORS
import authRoutes from "./routes/auth.Route.js";
import adminRoutes from "./routes/role/admin.routes.js";
import facultyRoutes from "./routes/role/faculty.routes.js";
import studentRoutes from "./routes/role/student.routes.js";
import formRoutes from "./controllers/form.controller.js";
import eventRoutes from "./routes/eventRoutes.js";
import opportunityRoutes from "./routes/activities/opportunityRoutes.js";
import postRoutes from "./routes/activities/postRoutes.js";
import discussionRoutes from "./routes/activities/discussionsRoutes.js";
import { startEventScheduler } from "./middlewares/startEventSchedular.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// console.log(process.env.MONGO_URI);
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Enable CORS

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
// Routes
startEventScheduler();

// Database Connection
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log("DB Connection Error:", err));

// Server Start
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
