import express from "express";
import dotenv from "dotenv";
dotenv.config({});

const app = express();

app.get("/", (req, res) => {
	res.json({
		Message: "Hello World C..",
	});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Server started on the PORT$${PORT}`);
});
