import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-2 animate-fade-in-up">
      <Button
        onClick={scrollToTop}
        className="rounded-md w-12 h-12 p-0 shadow-glow bg-back-to-top hover:bg-back-to-top/90"
        size="icon"
        aria-label="Nazad na vrh"
      >
        <ChevronUp className="w-6 h-6 text-white" />
      </Button>
      <Button
        onClick={scrollToBottom}
        className="rounded-md w-12 h-12 p-0 shadow-glow bg-back-to-top hover:bg-back-to-top/90"
        size="icon"
        aria-label="Idi na dno"
      >
        <ChevronDown className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
};
