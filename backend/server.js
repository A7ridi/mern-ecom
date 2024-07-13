const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");

// handling uncaught exception
process.on("uncaughtException", (err) => {
	console.log(err);
	process.exit(1);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
	dotenv.config();
}

connectDatabase(process.env.DB_URI);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});

// handling promise rejection
process.on("unhandledRejection", (err) => {
	console.log(err);
	console.log("Shutting down server");

	server.close(() => {
		process.exit(1);
	});
});
