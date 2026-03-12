import { useState } from "react";
import MyChats from "../components/MyChats";
import RequestList from "../components/RequestList";
import Chat from "../components/Chat";
import ThemeToggle from "../components/ThemeToggle";

function Dashboard() {

  const [connectionId, setConnectionId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-6 transition-colors duration-200">

      {/* Header with Title and Theme Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          ShareCircle
        </h1>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Chats */}
        <div className="col-span-1 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg dark:shadow-xl dark:shadow-gray-950 transition-colors duration-200">

          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            My Chats
          </h2>

          <MyChats setConnectionId={setConnectionId} />

        </div>

        {/* Requests */}
        <div className="col-span-2 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg dark:shadow-xl dark:shadow-gray-950 transition-colors duration-200">

          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
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