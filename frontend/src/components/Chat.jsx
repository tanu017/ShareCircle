import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat({ connectionId, userId }) {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

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
      .then(data => setMessages(data));

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
      senderId: userId,
      message: text
    };

    socket.emit("send_message", messageData);

    setMessages((prev) => [...prev, messageData]);

    setText("");
  };

  return (
    <div style={{ width: "400px", margin: "40px auto" }}>
      <h3>Chat</h3>

      <div style={{
        height: "300px",
        overflowY: "auto",
        border: "1px solid gray",
        padding: "10px"
      }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.sender}</b>: {msg.message}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message"
          style={{ width: "70%" }}
        />

        <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;