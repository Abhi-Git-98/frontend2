import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // 🔥 Scroll effect + hero fade
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const hero = document.querySelector(".hero-section");

      setScrolled(scrollY > 10);

      if (hero) {
        hero.style.opacity = scrollY > 0 ? 1 - Math.min(scrollY / 50, 1) : 1;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 Navbar height → CSS variable (for News ticker)
  useEffect(() => {
    const navbar = document.getElementById("navbar");

    const setNavHeight = () => {
      if (navbar) {
        document.documentElement.style.setProperty(
          "--nav-height",
          navbar.offsetHeight + "px"
        );
      }
    };

    setNavHeight();
    window.addEventListener("resize", setNavHeight);

    return () => window.removeEventListener("resize", setNavHeight);
  }, []);

  return (
    <>
      {/* 🌆 Background */}
      <div className={`background-main ${scrolled ? "visible" : ""}`} />

      {/* 🏞️ Hero */}
      <header className={`hero-section ${scrolled ? "fade-out" : "fade-in"}`} />

      {/* 🌙 Navbar */}
      <nav
        id="navbar"
        className={`navbar navbar-expand-lg fixed-top ${
          scrolled ? "scrolled-nav" : "transparent-nav"
        }`}
      >
        <div className="container navsize">
          <Link className="navbar-brand fw-bold text-black" to="/">
            <img
              src="https://genvision-26.onrender.com/uploads/genvision_logo.jpeg"
              alt="genvision logo"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                marginRight: "8px",
              }}
            />
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

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav text-center">
              <li className="nav-item">
                <Link className="nav-link text-black" to="/">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-black" to="/Events">
                  Events
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-black" to="/Coordinators">
                  Coordinators
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-black" to="/Speakers">
                  Speakers
                </Link>
              </li>
              <li className="nav-item ms-lg-3">
                <Link
                  className="nav-link text-black register-btn"
                  to="/Participants"
                >
                  Join Us
                </Link>
              </li>
              <li className="nav-item ms-lg-3">
                <Link className="login-btn" to="/login">
                  <span>Login</span>
                  <i>→</i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* 📰 News ticker*/}
    </>
  );
}
