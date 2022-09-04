const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1);
});

// config
dotenv.config();
connectDatabase(process.env.DB_URI);

const PORT = process.env.PORT || 8080;

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
