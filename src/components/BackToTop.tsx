import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 animate-fade-in-up">
      <button
        onClick={scrollToTop}
        className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.2)] hover:bg-background/95 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center group"
        aria-label="Nazad na vrh"
      >
        <ChevronUp className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
      </button>
      <button
        onClick={scrollToBottom}
        className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.2)] hover:bg-background/95 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center group"
        aria-label="Idi na dno"
      >
        <ChevronDown className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
      </button>
    </div>
  );
};
