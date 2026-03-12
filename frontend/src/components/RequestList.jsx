import { useEffect, useState } from "react";

function RequestList({ setConnectionId }) {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Extract userId from JWT token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  useEffect(() => {

    fetch("http://localhost:5000/api/requests", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log("Requests:", data);
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });

  }, []);

  const helpRequest = async (requestId) => {

    const res = await fetch(`http://localhost:5000/api/help/${requestId}/help`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();

    console.log("Help response:", data);

    if (!res.ok) {
      setError(data.message || "Failed to help this request");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setConnectionId(data.connection._id);

  };

  if (loading) {
    return (
      <h3 className="text-gray-500 dark:text-gray-400">
        Loading requests...
      </h3>
    );
  }

  return (
  <div>

    {error && (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded mb-4 text-sm">
        {error}
      </div>
    )}

    {requests.length === 0 && (
      <p className="text-gray-500 dark:text-gray-400">
        No requests found
      </p>
    )}

    {requests.map(req => {
      const isOwnRequest = currentUserId && req.createdBy === currentUserId;

      return (
      <div
        key={req._id}
        className="bg-gray-50 dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700 transition-colors duration-200"
      >

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {req.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {req.description}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          📍 {req.location}
        </p>

        <button
          disabled={isOwnRequest}
          className={`mt-3 px-4 py-2 rounded transition-colors duration-200 text-white font-medium ${
            isOwnRequest
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          }`}
          onClick={() => helpRequest(req._id)}
          title={isOwnRequest ? "You cannot help your own request" : "Help with this request"}
        >
          {isOwnRequest ? "Your Request" : "Help"}
        </button>

      </div>
      );
    })}

  </div>
);
}

export default RequestList;