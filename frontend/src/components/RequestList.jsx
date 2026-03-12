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
      <h3 className="text-gray-500">
        Loading requests...
      </h3>
    );
  }

  return (
  <div>

    {requests.length === 0 && (
      <p className="text-gray-500">
        No requests found
      </p>
    )}

    {requests.map(req => (

      <div
        key={req._id}
        className="bg-white shadow-md rounded-lg p-4 mb-4 border"
      >

        <h3 className="text-lg font-semibold">
          {req.title}
        </h3>

        <p className="text-gray-600 mt-1">
          {req.description}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          📍 {req.location}
        </p>

        <button
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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