import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat({ connectionId, userId }) {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(userId);
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
  }, [currentUserId]);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {

    // join socket room
    socket.emit("join_chat", connectionId);

    // load old messages
    fetch(`http://localhost:5000/api/chat/${connectionId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("Error loading messages:", err));

    // listen for new messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };

  }, [connectionId]);

  const sendMessage = () => {

    if (!text.trim()) return;

    const messageData = {
      connectionId,
      senderId: currentUserId,
      message: text
    };

    socket.emit("send_message", messageData);

    setText("");
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

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = msg.sender?.toString() === currentUserId;
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
          className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-6 py-2 rounded-full transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;