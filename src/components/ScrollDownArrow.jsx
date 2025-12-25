import { useEffect, useState } from "react";
import "../css/scrollArrow.css";

export default function ScrollDownArrow() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const scrollPercent = (scrollTop / docHeight) * 100;
      setShow(scrollPercent < 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToMiddle = () => {
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    window.scrollTo({
      top: docHeight * 0.5,   // ⬅️ 50%
      behavior: "smooth",
    });
  };

  if (!show) return null;

  return (
    <div
      className="scroll-indicator"
      onClick={scrollToMiddle}
      role="button"
      aria-label="Scroll to middle"
    >
      <svg
        className="arrow-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="17" />
        <polyline points="6 11 12 17 18 11" />
      </svg>
    </div>
  );
}
