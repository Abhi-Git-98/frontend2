import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // 🔥 Hero fade while scrolling
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector(".hero-section");
      const scrollY = window.scrollY;

      if (hero) {
        hero.style.opacity = scrollY > 0 ? 1 - Math.min(scrollY / 50, 1) : 1;
      }

      setScrolled(scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Background */}
      <div className={`background-main ${scrolled ? "visible" : ""}`} />

      {/* Hero Section */}
      <header className={`hero-section ${scrolled ? "fade-out" : "fade-in"}`}>
        
        {/* ↓ Scroll Arrow (visible only at top) */}
        {!scrolled && (
          <div
            className="scroll-arrow"
            onClick={() =>
              window.scrollTo({ top: 600, behavior: "smooth" })
            }
          >
            ↓
          </div>
        )}
      </header>

      {/* Navbar */}
      <nav
        className={`navbar navbar-expand-lg fixed-top ${
          scrolled ? "scrolled-nav" : "transparent-nav"
        }`}
      >
        <div className="container navsize">
          <Link className="navbar-brand fw-bold text-black" to="/">
            Genvision 2026
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav text-center">
              <li className="nav-item">
                <Link className="nav-link text-black" to="/">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-black" to="/Events">Events</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-black" to="/Coordinators">Coordinators</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-black" to="/Guests">Guests</Link>
              </li>
              <li className="nav-item" style={{ marginLeft: "10%" }}>
                <Link className="nav-link text-black register-btn center" to="/Participants">
                  Join Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

