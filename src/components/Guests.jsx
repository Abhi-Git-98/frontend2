import { useEffect, useState } from "react";
import API from "../api";
import "../css/guests.css";

export default function Guests() {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    API.get("/guests")
      .then((res) => setGuests(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
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
  );
}
