import { useEffect, useState } from "react";
import API from "../api";
import "../css/guests.css";

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
        More Events Coming Soon...
      </h1>

        <div className="d-flex flex-wrap justify-content-center gap-4">
          {events.map((g) => (
            <div key={g._id} className="guest-card margin-x" style={{marginRight:"10px",marginLeft:"10px"}}>
              <div className="guest-img-wrapper">
                <img
  src={`https://genvision-26.onrender.com${g.image.startsWith("/") ? g.image : "/" + g.image}`}
  alt={g.name}
  className="card-img-top"
  style={{ height: "400px", objectFit: "cover" }}
/>
                <div className="guest-overlay">
                  <h4>{g.name}</h4>
                  <p className="desc">{g.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}