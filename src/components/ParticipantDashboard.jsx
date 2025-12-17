import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../css/dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    API.get("/participants/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setData(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  // 🔁 Participate / Cancel toggle
  const toggleParticipation = async (eventId, participated) => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        `/participants/participate/${eventId}`,
        { cancel: participated },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData((prev) => ({
        ...prev,
        events: prev.events.map((e) =>
          e._id === eventId
            ? { ...e, participated: !participated }
            : e
        ),
      }));
    } catch {
      alert("Participation error 💀");
    }
  };

  if (!data)
    return <div className="loader-screen">Loading... ⏳</div>;

  return (
    <div className="dashboard-bg">
      <div className="container">

        {/* ================= PROFILE ================= */}
        <div className="profile-card">
          <h2>Welcome, {data.fullName} </h2>
          <p><b>Email:</b> {data.email}</p>
          <p><b>Group:</b> {data.groupKeyword || "Individual"}</p>
          <p><b>Payment Status:</b> {data.paymentStatus==="confirmed"? "Your Payment is Confirmed" : "Your Payment is not confirmed yet"}</p>

          <button
            className="btn-logout"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login", { replace: true });
            }}
          >
            Logout 
          </button>
        </div>

        {/* ================= EVENTS ================= */}
        <h3 className="events-title">Events </h3>

        <div className="events-grid">
          {data.events.map((event) => (
            <div key={event._id} className="event-card">
              <img
                src={`https://genvision-26.onrender.com/${event.image.replace(/^\/+/, "")}`}
                alt={event.title}
                className="event-image"
              />

              <div className="event-body">
                <h4>{event.title}</h4>

                <button
                  className={`btn-action ${
                    event.participated ? "btn-cancel" : "btn-participate"
                  }`}
                  onClick={() =>
                    toggleParticipation(event._id, event.participated)
                  }
                >
                  {event.participated
                    ? "Cancel Participation ❌"
                    : "Participate 🚀"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
