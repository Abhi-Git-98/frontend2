import { useEffect, useRef, useState } from "react";
import "../css/news.css";
import biofusabsreg from "./BIOFUSION_POSTER_PRESENTATION_COMPETITION.pdf";
import hostelaccomo from "./Hostel_Accomodation_Genvision_2025-26.pdf";

export default function NewsTicker() {
  const [show, setShow] = useState(false);
  const textRef = useRef(null);
  const tickerRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const navbarHeight = 60;

    const handleScroll = () => {
      if (window.scrollY > navbarHeight) setShow(true);
      else setShow(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ⭐ ZERO-GAP marquee effect
  useEffect(() => {
    if (!show) return;

    const text = textRef.current;
    const ticker = tickerRef.current;
    let pos = ticker.offsetWidth;

    let animationFrame;

    const loop = () => {
      if (!pausedRef.current) {
        pos -= 1.7; // ⭐ speed — 1 normal, 0.5 slow, 2 fast

        text.style.transform = `translateX(${pos}px)`;
      }

      if (pos <= -text.offsetWidth) {
        pos = ticker.offsetWidth; // ⭐ ZERO-GAP reset
      }

      animationFrame = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrame);
  }, [show]);

  return (
    <>
      {show && (
        <div
          className="news-ticker"
          ref={tickerRef}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          <div className="news-ticker-track">
            <span ref={textRef}>
              🔴Poster presentation abstract submission [click for{" "}
              <a href={biofusabsreg} download>
                Details
              </a>
              ] 🔴 Registrations are open 🔴 Accomodation for outstation
              students are full 🔴 After payment verification login link and
              credentials will be shared on your registered email. 🔴 <b>Register for Events using your email id only.</b>{" "}
              🔴 Details about Hostel accomodation [<a href = {hostelaccomo} download>Click here</a>] 🔴
            </span>
          </div>
        </div>
      )}
    </>
  );
}
