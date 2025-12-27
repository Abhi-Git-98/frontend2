import { useEffect, useState } from "react";
import API from "../api";
import "../css/events.css";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-8">
      <h1
        className="text-3xl font-bold mb-4 text-white"
        style={{ textAlign: "center" }}
      >
        GenVision Events
      </h1>

      <div className="container">
        <div className="row justify-content-center">
          {events.map((g) => (
            <div
              key={g._id}
              className="col-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center"
            >
              <div className="event-card w-100">
                <div className="event-img-wrapper">
                  <img
                    src={`https://genvision-26.onrender.com${
                      g.image.startsWith("/") ? g.image : "/" + g.image
                    }`}
                    alt={g.name}
                    className="card-img-top"
                    // style={{ height: "280px", objectFit: "cover" }}
                  />
                  <div className="event-overlay">
                    <h4>{g.name}</h4>
                    <p className="desc">{g.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ================= Event Queries Contact ================= */}
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
