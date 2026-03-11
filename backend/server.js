const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const helpRoutes = require("./routes/helpRoutes");
const chatRoutes = require("./routes/chatRoutes");

const Message = require("./models/Message");

const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/chat", chatRoutes);

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
    socket.join(connectionId);
  });

  // Send message
  socket.on("send_message", async (data) => {
    try {

      const newMessage = new Message({
        connection: data.connectionId,
        sender: data.senderId,
        message: data.message
      });

      await newMessage.save();

      io.to(data.connectionId).emit("receive_message", newMessage);

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