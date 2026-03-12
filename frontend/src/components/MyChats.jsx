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
      .then(data => {
        setChats(data);
      });

  }, []);

  return (
    <div>

      {chats.map(chat => (

        <div
          key={chat._id}
          onClick={() => setConnectionId(chat._id)}
          className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white m-2 p-3 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
        >
          {chat.request.title}
        </div>

      ))}

    </div>
  );
}

export default MyChats;