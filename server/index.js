import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import joinRequestRoutes from "./routes/joinRequestRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import Message from "./models/Message.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://getcollabsphere.vercel.app",
  "https://collab-sphere-wheat.vercel.app",
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "CollabSphere API running! 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/joinrequests", joinRequestRoutes);
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (projectId) => {
    socket.join(projectId);
    console.log(`User joined room: ${projectId}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const message = await Message.create({
        project: data.projectId,
        sender: data.senderId,
        text: data.text,
      });
      const populated = await message.populate("sender", "name avatar");
      io.to(data.projectId).emit("receiveMessage", populated);
    } catch (error) {
      console.log("Message error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    httpServer.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000} 🚀`);
    });
  })
  .catch((err) => console.log(err));