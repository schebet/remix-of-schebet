import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImageSrcSet from "@/assets/hero-village.jpg?w=640;768;1024;1280;1920&format=webp&quality=85&as=srcset";
import heroImageUrl from "@/assets/hero-village.jpg?w=1920&format=webp&quality=85";
import { getHeroSizes } from "@/lib/imageUtils";
export const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleExploreClick = () => {
    document.getElementById("blog")?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <section id="home" className="relative h-screen overflow-hidden">
      {/* Parallax Background with picture element for responsive images */}
      <div className="absolute inset-0 overflow-hidden" style={{
      transform: `translateY(${scrollY * 0.5}px)`
    }}>
        <img 
          src={heroImageUrl}
          srcSet={heroImageSrcSet}
          sizes={getHeroSizes()}
          alt="selo Šebet"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-4xl animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient-primary">
            selo Šebet
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-8 max-w-2xl mx-auto">
            Dokumentarni sajt o selu — istorija, kultura, ljudi i priče našeg sela
          </p>
          <div className="flex flex-col gap-4 items-center justify-center">
            <Button 
              size="lg" 
              onClick={handleExploreClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
            >
              Istražite priče
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a href="#blog" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary animate-bounce cursor-pointer">
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>;
};