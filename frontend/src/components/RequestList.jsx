import { useEffect, useState } from "react";

function RequestList({ setConnectionId }) {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

    {requests.length === 0 && (
      <p className="text-gray-500 dark:text-gray-400">
        No requests found
      </p>
    )}

    {requests.map(req => (

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
          className="mt-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded transition-colors duration-200"
          onClick={() => helpRequest(req._id)}
        >
          Help
        </button>

      </div>

    ))}

  </div>
);
}

export default RequestList;