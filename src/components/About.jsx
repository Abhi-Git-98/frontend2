import { useEffect, useState } from "react";
import API from "../api";
import { Carousel } from "react-bootstrap";
import "../css/about.css";
import "../css/guests.css";
import "../css/events.css";

import { aboutFallback } from "../fallback/aboutFallback";
import { eventsFallback } from "../fallback/eventsFallback";

export default function AboutPage() {
  const [about, setAbout] = useState(null);
  const [events, setEvents] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const logosPerRow = 6; // lg screen साठी

  const baseURL = "https://genvision-26.onrender.com"; // Server base URL

  const LazyImage = ({ src, alt, className, style }) => {
    if (!src) return null;

    let finalSrc = src;

    // Static fallback paths → don't attach baseURL
    if (!src.startsWith("http") && !src.startsWith("/fallback")) {
      finalSrc = `${baseURL}${src}`;
    }

    return (
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        className={className}
        style={{ objectFit: "cover", ...style }}
      />
    );
  };

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await API.get("/about");
        setAbout(res.data);
      } catch (err) {
        console.error("Backend down → loading fallback About");
        setAbout(aboutFallback); // ⭐ fallback येथे
      }
    };
    fetchAbout();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Backend down → loading fallback Events");
        setEvents(eventsFallback); // ⭐ fallback येथे
      }
    };
    fetchEvents();
  }, []);

  const [guests, setGuests] = useState([]);

  useEffect(() => {
    API.get("/guests")
      .then((res) => setGuests(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!about) return <p>Loading...</p>;

  return (
    <div className="container my-5">
      {/* Hero Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        {!isMobile ? (
          <div
            style={{
              display: "flex",
              gap: "20px",
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              alignItems: "flex-start",
            }}
          >
            {/* Poster */}
            {about.poster && (
              <div
                style={{
                  flex: "0 0 auto",
                  maxWidth: "400px",
                  width: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <LazyImage
                  src={about.poster}
                  alt="Poster"
                  style={{
                    width: "100%",
                    height: "500px",
                    display: "block",
                    borderRadius: "12px",
                  }}
                />
              </div>
            )}

            {/* Description */}
            <div
              style={{
                flex: 1,
                minWidth: "250px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  color: "#333",
                  textAlign: "justify",
                  padding: "15px 20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "12px",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                  margin: 0,
                }}
              >
                {about.description}
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              perspective: "1000px",
              maxWidth: "400px",
              margin: "0 auto 30px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <div
              onClick={() => setFlipped((prev) => !prev)}
              style={{
                width: "100%",
                cursor: "pointer",
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 0.6s",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front */}
              <div
                style={{
                  backfaceVisibility: "hidden",
                  width: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <LazyImage
                  src={about.poster}
                  alt="Poster"
                  style={{
                    width: "250px",
                    height: "350px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </div>
              {/* Back */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%", // ⭐ match with poster
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  backgroundColor: "#f9f9f9",
                  padding: "15px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center", // ⭐ vertically center text
                  justifyContent: "center", // ⭐ center text horizontally
                }}
              >
                <p
                  style={{
                    fontSize: "0.55rem",
                    lineHeight: "1.5rem",
                    color: "#333",
                    textAlign: "justify",
                    margin: 0,
                    maxHeight: "100%",
                    overflowY: "auto", // ⭐ scroll if text is long
                  }}
                >
                  {about.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8">
        <h1
          className="text-3xl font-bold mb-4 text-white"
          style={{ textAlign: "center" }}
        >
          Our Speakers
        </h1>

        <div className="container">
          <div className="row justify-content-center">
            {guests.map((g) => (
              <div
                key={g._id}
                className="col-6 col-md-4 col-lg-4 mb-4 d-flex justify-content-center"
              >
                <div className="guest-card w-100">
                  <div className="guest-img-wrapper">
                    <img
                      src={`https://genvision-26.onrender.com${
                        g.image.startsWith("/") ? g.image : "/" + g.image
                      }`}
                      alt={g.name}
                      className="guest-img"
                    />

                    <div className="guest-overlay">
                      <h4>{g.name}</h4>
                      <p className="designation">{g.designation}</p>
                      <p className="desc">{g.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
            Please join the community for the GenVision events.
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
          {/* <p className="event-contact-sub">
            Join the Community for more updates👇
          </p>
          <a href="https://chat.whatsapp.com/EKGdRB2F6DkBQCf8qtC7hE">
            Whatsapp link
          </a>
          <p className="event-contact-sub">
            Note: Before joining the group make sure to enroll and register
            yourselves for the events.
          </p> */}

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

      {/* Gallery */}
      {about.gallery.length > 0 && (
        <Carousel
          className="mb-4 custom-carousel carousel-fade"
          interval={2000}
          pause="hover"
          style={{
            borderRadius: "20px",
            marginTop: "10%",
            overflow: "hidden",
          }}
        >
          {about.gallery.map((img, idx) => (
            <Carousel.Item key={idx}>
              <LazyImage
                src={img}
                alt={`Gallery ${idx}`}
                style={{
                  width: "100%",
                  height: "500px",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      {/* Sponsors */}
      <div
        style={{
          backgroundColor: "#fff",
          width: "100%",
          padding: "20px 0",
          marginBottom: "4%",
        }}
      >
        <h3 className="text-center mb-3">Our Sponsors</h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {about.sponsors.map((s, idx) => {
            const isSecondRow = idx >= logosPerRow && idx < logosPerRow * 2;

            return (
              <div
                key={idx}
                className="col-6 col-md-4 col-lg-3"
                style={{
                  flex: "0 0 140px",
                  textAlign: "center",
                  overflow: "hidden",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                }}
              >
                <LazyImage
                  src={s.logo}
                  alt={s.name}
                  style={{
                    width: "140px",
                    height: "80px",
                    objectFit: "contain",
                    
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
