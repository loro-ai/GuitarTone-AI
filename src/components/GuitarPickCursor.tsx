import { useEffect, useState } from "react";

export function GuitarPickCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = e.target as HTMLElement;
      setHovering(!!el.closest('a, button, [role="button"], input, select, textarea, label'));
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    document.body.style.cursor = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const scale = clicking ? 0.72 : hovering ? 1.25 : 1;
  const rotate = hovering ? "38deg" : "0deg";

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) rotate(${rotate}) scale(${scale})`,
        pointerEvents: "none",
        zIndex: 99999,
        transition: "transform 0.1s cubic-bezier(0.23, 1, 0.32, 1)",
        willChange: "transform, left, top",
      }}
    >
      <svg width="26" height="32" viewBox="0 0 26 32" xmlns="http://www.w3.org/2000/svg">
        {/* Drop shadow layer */}
        <path
          d="M13 1.5 C6.5 1.5 1.5 6.5 1.5 13 C1.5 21.5 6.5 30 13 31.5 C19.5 30 24.5 21.5 24.5 13 C24.5 6.5 19.5 1.5 13 1.5 Z"
          fill="rgba(0,0,0,0.5)"
          transform="translate(1, 1.5)"
        />
        {/* Pick body */}
        <path
          d="M13 1 C6 1 1 6 1 12.5 C1 21 6.5 30 13 31 C19.5 30 25 21 25 12.5 C25 6 20 1 13 1 Z"
          fill={hovering ? "#D4AA44" : "#C49B38"}
        />
        {/* Highlight */}
        <path
          d="M13 4 C8.5 4 5 7.5 5 12"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* .60 text (signature Frusciante pick) */}
        <text
          x="13"
          y="17"
          textAnchor="middle"
          fill="rgba(255,255,255,0.8)"
          fontSize="7"
          fontFamily="'Courier New', monospace"
          fontWeight="bold"
        >
          .60
        </text>
      </svg>
    </div>
  );
}
