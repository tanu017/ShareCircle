import { useEffect, useState } from "react";

function MyChats({ setConnectionId }) {

  const [chats, setChats] = useState([]);

  useEffect(() => {

    fetch("http://localhost:5000/api/help/my-connections", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => setChats(data));

  }, []);

  return (
    <div>

      <h3>My Chats</h3>

      {chats.map(chat => (

        <div
          key={chat._id}
          style={{border:"1px solid gray", margin:"5px", padding:"5px"}}
          onClick={() => setConnectionId(chat._id)}
        >
          {chat.request.title}
        </div>

      ))}

    </div>
  );
}

export default MyChats;