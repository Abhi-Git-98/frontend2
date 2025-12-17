import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero-section");
  const scrollY = window.scrollY;

  // 🔥 जर थोडंसुद्धा scroll झालं (>= 1 pixel), opacity कमी कर
  if (scrollY > 0) {
    if(hero){
      hero.style.opacity = 1 - Math.min(scrollY / 50, 1); // जलद fade
    }
  } else {
    if(hero){
       hero.style.opacity = 1;
    }
  }
});

  useEffect(() => {
    const handleScroll = () => {
      // जरा जरी scroll झाला तरी hero-section गायब
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

   useEffect(() => {
  const handleScroll = () => {
    const hero = document.querySelector(".hero-section");
    const scrollY = window.scrollY;
    if (scrollY > 0) {
      hero.style.opacity = 1 - Math.min(scrollY / 50, 1);
    } else {
      hero.style.opacity = 1;
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <>
      {/* 🌆 Second Background (always behind) */}
      <div className={`background-main ${scrolled ? "visible" : ""}`} />

      {/* 🏞️ Hero Section (visible only at top) */}
      <header className={`hero-section ${scrolled ? "fade-out" : "fade-in"}`}>
      {/* <section className="hero-section"> */}
          {/* <h1 className="hero-text"></h1> */}
      {/* </section> */}
      </header>
     

      {/* 🌙 Navbar */}
      <nav
        className={`navbar navbar-expand-lg fixed-top ${
          scrolled ? "scrolled-nav" : "transparent-nav"
        }`}
      >
        <div className="container navsize">
          <Link className="navbar-brand fw-bold text-black" to="/">
              <img src={`https://genvision-26.onrender.com/uploads/genvision_logo.jpeg}`} alt="genvision logo" />
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
              <li className="nav-item"><Link className="nav-link text-black" to="/">About</Link></li>
              <li className="nav-item"><Link className="nav-link text-black" to="/Events">Events</Link></li>
              <li className="nav-item"><Link className="nav-link text-black" to="/Coordinators">Coordinators</Link></li>
              <li className="nav-item"><Link className="nav-link text-black" to="/Guests">Guests</Link></li>
              <li className="nav-item" style={{MarginLeft:"10%"}}><Link className="nav-link text-black register-btn center" to="/Participants">Join Us</Link></li>
              {/* <li className="nav-item" style={{MarginLeft:"10%"}}><Link className="nav-link text-black register-btn center" to="/Login">Login</Link></li> */}

            </ul>
            
          </div>
        </div>
      </nav>
       
    </>
  );
}
