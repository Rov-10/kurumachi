"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 p-3 bg-black border border-nothing-border text-white rounded-lg group hover:border-nothing-red hover:scale-110 hover:shadow-[0_0_20px_rgba(240,26,26,0.4)] transition-all duration-300"
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}