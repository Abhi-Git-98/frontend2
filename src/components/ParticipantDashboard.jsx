import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../css/dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
      .then((res) => {
        setData(res.data);
      })
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
          e._id === eventId ? { ...e, participated: !participated } : e
        ),
      }));
    } catch {
      alert("Participation error 💀");
    }
  };

  if (!data) return <div className="loader-screen">Loading... ⏳</div>;

  const posterEvent = data?.events?.some(
    (e) => e.participated === true && e._id === "6948ea2fcd539f8680b658b9"
  );

  return (
    <div className="dashboard-bg">
      <div className="container">
        {/* ================= PROFILE ================= */}
        <div className="profile-card">
          <h2>Welcome, {data.fullName} </h2>
          <p>
            <b>Email:</b> {data.email}
          </p>
          {/* <p>
            <b>Genvision Id:</b> {data.registration_id}
          </p> */}
          <p>
            <b>Group:</b> {data.groupKeyword || "Individual"}
          </p>
          {/* <p>
            <b>Payment Status:</b>{" "}
            {data.paymentStatus === "confirmed"
              ? "Your Payment is Confirmed"
              : "Your Payment is Confirmed"}
          </p> */}
          <p>
            <b>Accommodation Status:</b>{" "}
            {data.accommodationStatus === "confirmed"
              ? "Your Accommodation is Confirmed"
              : "Pending"}
          </p>
          {data.accommodationStatus === "confirmed" && (
            <p>
              <b>Join Whatsapp Group:</b>{" "}
              <a
                href="https://chat.whatsapp.com/Dg8JC3QJVpOJahUolNwedq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Click here to join
              </a>
            </p>
          )}

          {posterEvent && (
            <div className="mt-4">
              <button
                className="btn-participate btn-poster-form"
                onClick={() => setShowForm(true)}
              >
                Poster Abstract Submission 📝
              </button>
            </div>
          )}
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
                src={`https://genvision-26.onrender.com/${event.image.replace(
                  /^\/+/,
                  ""
                )}`}
                alt={event.title}
                className="event-image"
              />

              {/* ================= HOVER RULES ================= */}
              {event.rules && event.rules.length > 0 && (
                <div className="event-rules">
                  <div className="rules-title">Event Rules 📜</div>
                  <ul>
                    {event.rules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="event-body">
                <h4>{event.title}</h4>

                <button
                  className={`btn-action ${
                    event.participated ? "btn-cancel" : "btn-participate"
                  }`}
                  onClick={() =>
                    toggleParticipation(event._id, event.participated)
                  }
                  disabled={
                    !event.participated &&
                    event.currentParticipants >= event.maxParticipants
                  }
                >
                  {event.participated
                    ? "Cancel Participation ❌"
                    : event.currentParticipants >= event.maxParticipants
                    ? "Event Full 🚫"
                    : "Participate 🚀"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-box">
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                ✖
              </button>

              <h3 style={{ marginBottom: "10px" }}>
                Poster Presentation – Google Form
              </h3>

              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLScfN4d6qEHs97fecPi9Cn4G5bkZ6ymgr6jHd1CLcVm382tMHQ/viewform?embedded=true"
                width="100%"
                height="520"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                title="Poster Form"
              >
                Loading…
              </iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
