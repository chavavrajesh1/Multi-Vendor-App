import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import http from "http";
import { initSocket } from "./socket/socket";
import "./modules/order/order.cron";

dotenv.config();

const PORT = process.env.PORT || 5000;

// create http server
const server = http.createServer(app);

// initialize socket
initSocket(server);

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();