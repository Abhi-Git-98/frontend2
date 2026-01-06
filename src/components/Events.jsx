import { useEffect, useState } from "react";
import API from "../api";
import "../css/events.css";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    API.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="events-title">GenVision Events</h1>

      <div className="container">
        <div className="row justify-content-center">
          {events.map((g) => (
            <div
              key={g._id}
              className="col-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center"
            >
              <div
                className="event-card"
                onClick={() => {
                  if (window.innerWidth <= 768) {
                    setSelectedEvent(g);
                  }
                }}
              >
                <div className="event-img-wrapper">
                  <img
                    src={`https://genvision-26.onrender.com${
                      g.image.startsWith("/") ? g.image : "/" + g.image
                    }`}
                    alt={g.name}
                    className="card-img-top"
                  />
                </div>
                <div className="mobile-hint">Tap for more information</div>

                {/* Desktop hover info bar */}
                <div className="event-info-bar">
                  <h4>{g.name}</h4>
                  <p>{g.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MOBILE MODAL ================= */}
      {selectedEvent && (
        <div className="mobile-modal">
          <div className="mobile-modal-content">
            <button
              className="close-btn"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>

            <h3>{selectedEvent.name}</h3>
            <p>{selectedEvent.description}</p>
          </div>
        </div>
      )}

      {/* ================= COMMUNITY JOIN SECTION ================= */}
      <div className="event-community-section mt-5">
        <p className="event-community-text">
          Please join the community for more updates regarding the GenVision
          events.
        </p>

        <p className="event-community-note">
          <strong>Note:</strong> Before joining the group make sure to enroll
          and register yourselves for the events.
        </p>

        <a
          href="https://chat.whatsapp.com/EKGdRB2F6DkBQCf8qtC7hE"
          target="_blank"
          rel="noopener noreferrer"
          className="event-community-btn"
        >
          🚀 Join WhatsApp Community
        </a>
      </div>

      {/* ================= CONTACT SECTION ================= */}
      <div className="event-contact-container mt-5">
        <h2 className="event-contact-title">Event Related Queries?</h2>
        <p className="event-contact-sub">Don’t Overthink.</p>

        <div className="event-contact-cards">
          <div className="event-contact-card">
            <span className="role">Event Head</span>
            <h3>Aditi</h3>
            <a href="tel:+918447551284">📞 +91 84475 51284</a>
          </div>

          <div className="event-contact-card">
            <span className="role">Event Head</span>
            <h3>Alankar</h3>
            <a href="tel:+919748948858">📞 +91 97489 48858</a>
          </div>
        </div>
      </div>
    </div>
  );
}
