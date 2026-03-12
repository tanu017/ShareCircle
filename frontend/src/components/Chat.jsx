import { useEffect, useState, useRef, useCallback } from "react";
import { socket } from "../socket";

function Chat({ connectionId, userId }) {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(userId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Extract userId from JWT token if not provided
  useEffect(() => {
    if (!currentUserId) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setCurrentUserId(payload.id);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, []);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ========================================
  // EFFECT 1: Load messages from API
  // This effect ONLY runs when connectionId changes
  // ========================================
  useEffect(() => {

    if (!connectionId) return;

    setIsLoading(true);
    setError("");

    const loadMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chat/${connectionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to load messages");
        }

        const data = await res.json();
        setMessages(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading messages:", err);
        setError("Failed to load messages. Please try again.");
        setIsLoading(false);
      }
    };

    loadMessages();

  }, [connectionId]); // ← Only connectionId, NOT messageIds or any other state

  // ========================================
  // EFFECT 2: Set up socket join and listeners
  // This effect ONLY runs when connectionId changes
  // ========================================
  useEffect(() => {

    if (!connectionId) return;

    // Join the chat room
    socket.emit("join_chat", connectionId);

    // Define the message handler (no extra dependencies)
    const handleReceiveMessage = (data) => {
      console.log("Received socket message:", data);
      console.log("Current connectionId:", connectionId);
      console.log("data.connection:", data.connection);

      // Only accept messages for the current connectionId
      // data.connection is the MongoDB ObjectId, connectionId might be string
      if (data.connection?.toString?.() !== connectionId?.toString?.() && data.connection !== connectionId) {
        console.log("Message filtered out - connection mismatch");
        return;
      }

      console.log("Message accepted, adding to state");

      // Add message to state
      // Check for duplicates by looking at current messages array
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(msg => msg._id === data._id);
        if (messageExists) {
          console.log("Message already exists, skipping");
          return prevMessages;
        }
        console.log("Adding new message to state");
        return [...prevMessages, data];
      });
    };

    // Set up socket listener
    socket.off("receive_message");
    socket.on("receive_message", handleReceiveMessage);

    // Cleanup function
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.emit("leave_chat");
    };

  }, [connectionId]); // ← Only connectionId

  const sendMessage = async () => {

    if (!text.trim() || !currentUserId) return;

    const messageData = {
      connection: connectionId,
      sender: currentUserId,
      message: text.trim()
    };

    try {
      // Step 1: Save message to MongoDB via API
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(messageData)
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const savedMessage = await res.json();

      // Step 2: Emit the saved message through socket to other clients
      socket.emit("send_message", savedMessage);

      // Step 3: Add message to local state immediately
      setMessages((prev) => {
        const messageExists = prev.some(msg => msg._id === savedMessage._id);
        if (messageExists) {
          return prev;
        }
        return [...prev, savedMessage];
      });

      // Step 4: Clear input
      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="flex flex-col h-96 bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-colors duration-200">
      {/* Chat Header */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-3 font-semibold shadow-sm">
        Chat
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            // Handle both 'sender' (from API) and 'senderId' (if ever received)
            const sender = msg.sender || msg.senderId;
            const isCurrentUser = sender?.toString() === currentUserId;

            return (
              <div
                key={msg._id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-xl break-words transition-colors duration-200 ${
                    isCurrentUser
                      ? "bg-blue-500 text-white rounded-br-none shadow-md"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="text-sm break-words">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 opacity-70 ${
                      isCurrentUser ? "text-blue-100" : "dark:text-gray-300 text-gray-600"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex gap-2 transition-colors duration-200">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-2 rounded-full transition-colors duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;