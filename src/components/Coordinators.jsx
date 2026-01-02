import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import API from "../api";
import "../css/coordinators.css";

const BASE = API.defaults.baseURL;

export default function Coordinators() {
  const [coordinators, setCoordinators] = useState([]);
  const [flippedId, setFlippedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const res = await API.get("/coordinators");
        setCoordinators(res.data.data || res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoordinators();

    // Detect mobile
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleFlip = (id) => {
    if (isMobile) setFlippedId((prev) => (prev === id ? null : id));
  };

  const DESIGNATION_GROUPS = [
    {
      title: "Organizing Committee",
      designations: ["OC"],
      col: "col-6 col-md-4 col-lg-4", // 3 per row
    },
    {
      title: "Heads",
      designations: ["Events Head", "Web team Head"],
      col: "col-6 col-md-3 col-lg-3", // 4 per row
    },
    {
      title: "Managers",
      designations: ["Managers"],
      col: "col-6 col-md-3 col-lg-3", // 4 per row
    },
    {
      title: "Coordinators",
      designations: ["Coordinators"],
      col: "col-6 col-md-3 col-lg-3", // 4 per row
    },
  ];

  const getByDesignation = (list, designations) =>
    list.filter((c) => designations.includes(c.designation));

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5 fw-bold text-white">Meet Our Team</h2>

      {DESIGNATION_GROUPS.map((group) => {
        const members = getByDesignation(coordinators, group.designations);
        if (!members.length) return null;

        return (
          <div key={group.title} className="mb-5">
            <h4 className="text-center section-title mb-4">{group.title}</h4>

            <div className="row g-4 justify-content-center">
              {members.map((c) => (
                <div key={c._id} className={group.col}>
                  <div
                    className={`flip-card 
    ${flippedId === c._id ? "flipped" : ""} 
    ${group.title === "Organizing Committee" ? "oc-card" : ""}
    ${group.title === "Heads" ? "head-card" : ""}
    ${group.title === "Managers" ? "manager-card" : ""}
    ${group.title === "Coordinators" ? "coordinator-card" : ""}
  `}
                    onClick={() => handleFlip(c._id)}
                  >
                    <div className="flip-card-inner">
                      {/* FRONT */}
                      <div className="flip-card-front">
                        <div className="back-overlay text-center">
                          <h4>{c.name}</h4>
                          <p>{c.designation}</p>
                          <div className="decor-line"></div>

                          {isMobile && <span className="hint">(tap)</span>}
                        </div>
                      </div>

                      {/* BACK */}
                      <div className="flip-card-back">
                        {c.image && (
                          <img
                            src={
                              c.image.startsWith("http")
                                ? c.image
                                : `${BASE.replace(
                                    "/api",
                                    ""
                                  )}/${c.image.replace(/^\/+/, "")}`
                            }
                            alt={c.name}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
