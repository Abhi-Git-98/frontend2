import { useEffect, useRef, useState } from "react";
import "../css/news.css";

export default function NewsTicker() {
  const [show, setShow] = useState(false);
  const textRef = useRef(null);
  const tickerRef = useRef(null);

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
      pos -= 1; // ⭐ speed — 1 normal, 0.5 slow, 2 fast

      text.style.transform = `translateX(${pos}px)`;

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
        <div className="news-ticker" ref={tickerRef}>
          <div className="news-ticker-content" ref={textRef}>
            🔴 Registration are open  🔴 Accommodation will be provided to
            only 15 students from each outstation college, other students can
            register but accommodation will not be provided.
          </div>
        </div>
      )}
    </>
  );
}

