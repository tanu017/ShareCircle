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
    return <h3>Loading requests...</h3>;
  }

  return (
    <div>

      <h2>Available Requests</h2>

      {requests.length === 0 && (
        <p>No requests found</p>
      )}

      {requests.map(req => (

        <div
          key={req._id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px"
          }}
        >

          <h3>{req.title}</h3>

          <p>{req.description}</p>

          <p><b>Location:</b> {req.location}</p>

          <button onClick={() => helpRequest(req._id)}>
            Help
          </button>

        </div>

      ))}

    </div>
  );
}

export default RequestList;