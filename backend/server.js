const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");  

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const helpRoutes = require("./routes/helpRoutes");
const chatRoutes = require("./routes/chatRoutes");

const Message = require("./models/Message");

const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Middleware
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/chat", chatRoutes);

// Message creation endpoint
const authMiddleware = require("./middleware/authMiddleware");
const { createMessage } = require("./controllers/chatController");
app.post("/api/messages", authMiddleware, createMessage);

app.get("/", (req, res) => {
  res.send("ShareCircle API running");
});

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Socket connection
io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  // Join chat room
  socket.on("join_chat", (connectionId) => {
    console.log(`Socket ${socket.id} joining room: ${connectionId}`);
    socket.join(connectionId);
    console.log(`Rooms for socket ${socket.id}:`, socket.rooms);
  });

  // Send message
  socket.on("send_message", (data) => {
    try {
      const roomName = data.connection.toString();
      console.log(`Broadcasting to room: ${roomName}`, data);
      console.log(`Sockets in room: ${io.sockets.adapter.rooms.get(roomName)?.size || 0}`);
      // Broadcast the message to all users in the chat room
      // data already comes as a saved message from the API
      io.to(roomName).emit("receive_message", data);
    } catch (error) {
      console.error("Message error:", error);
    }
  });

});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});