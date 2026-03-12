import { useState } from "react";
import MyChats from "../components/MyChats";
import RequestList from "../components/RequestList";
import Chat from "../components/Chat";

function Dashboard() {

  const [connectionId, setConnectionId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        ShareCircle
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {/* Chats */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow">

          <h2 className="text-xl font-semibold mb-3">
            My Chats
          </h2>

          <MyChats setConnectionId={setConnectionId} />

        </div>

        {/* Requests */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">

          <h2 className="text-xl font-semibold mb-3">
            Available Requests
          </h2>

          <RequestList setConnectionId={setConnectionId} />

        </div>

      </div>

      {/* Chat Window */}
      {connectionId && (
        <div className="mt-6">
          <Chat connectionId={connectionId} />
        </div>
      )}

    </div>
  );
}

export default Dashboard;