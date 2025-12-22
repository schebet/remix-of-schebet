import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Facebook, Twitter, Github, Rss } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = ({ selectedCategory, onCategoryChange }: { 
  selectedCategory?: string; 
  onCategoryChange?: (category: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  
  const handleNavClick = (sectionId: string) => {
    setIsOpen(false);
    
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
    } else {
      // If we're on home page, smooth scroll to section
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="fixed top-0 w-full bg-card/80 backdrop-blur-lg border-b border-border z-50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => handleNavClick('home')} className="text-2xl font-bold text-gradient-primary cursor-pointer">
            selo Šebet
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavClick('home')} className="text-foreground hover:text-primary transition-colors cursor-pointer">
              Početna
            </button>
            <button onClick={() => handleNavClick('blog')} className="text-foreground hover:text-primary transition-colors cursor-pointer">
              Blog
            </button>
            <button onClick={() => handleNavClick('gallery')} className="text-foreground hover:text-primary transition-colors cursor-pointer">
              Galerija
            </button>
            <button onClick={() => handleNavClick('about')} className="text-foreground hover:text-primary transition-colors cursor-pointer">
              O selu
            </button>
            
            <div className="flex items-center gap-4 ml-4 border-l border-border pl-4">
              <a href="https://www.facebook.com/seloSebet" target="_blank" rel="noopener noreferrer" 
                 className="hover:scale-110 transition-transform"
                 aria-label="Facebook">
                <Facebook className="w-5 h-5" style={{ color: '#1877F2' }} />
              </a>
              <a href="https://x.com/seloschebet" target="_blank" rel="noopener noreferrer"
                 className="hover:scale-110 transition-transform"
                 aria-label="X (Twitter)">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@schebet_selo" target="_blank" rel="noopener noreferrer"
                 className="hover:scale-110 transition-transform"
                 aria-label="TikTok">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="https://github.com/schebet/schebet" target="_blank" rel="noopener noreferrer"
                 className="hover:scale-110 transition-transform"
                 aria-label="Github">
                <Github className="w-5 h-5 text-[#181717] dark:text-white" />
              </a>
              <a href="/rss.xml" target="_blank" rel="noopener noreferrer"
                 className="hover:scale-110 transition-transform"
                 aria-label="RSS Feed">
                <Rss className="w-5 h-5" style={{ color: '#FF6600' }} />
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-muted"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in-up">
            <button onClick={() => handleNavClick('home')} className="block w-full text-left text-foreground hover:text-primary transition-colors cursor-pointer">
              Početna
            </button>
            <button onClick={() => handleNavClick('blog')} className="block w-full text-left text-foreground hover:text-primary transition-colors cursor-pointer">
              Blog
            </button>
            <button onClick={() => handleNavClick('gallery')} className="block w-full text-left text-foreground hover:text-primary transition-colors cursor-pointer">
              Galerija
            </button>
            <button onClick={() => handleNavClick('about')} className="block w-full text-left text-foreground hover:text-primary transition-colors cursor-pointer">
              O selu
            </button>
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <a href="https://www.facebook.com/seloSebet" target="_blank" rel="noopener noreferrer"
                 className="hover:scale-110 transition-transform"
                 aria-label="Facebook">
                <Facebook className="w-5 h-5" style={{ color: '#1877F2' }} />
              </a>
              <a href="https://x.com/seloschebet" target="_blank" rel="noopener noreferrer"
                 className="hover:scale-110 transition-transform"
                 aria-label="X (Twitter)">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@schebet_selo" target="_blank" rel="noopener noreferrer"
                 className="hover:scale-110 transition-transform"
                 aria-label="TikTok">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="https://github.com/schebet/schebet" target="_blank" rel="noopener noreferrer"
                 className="hover:scale-110 transition-transform"
                 aria-label="Github">
                <Github className="w-5 h-5 text-[#181717] dark:text-white" />
              </a>
              <a href="/rss.xml" target="_blank" rel="noopener noreferrer"
                 className="hover:scale-110 transition-transform"
                 aria-label="RSS Feed">
                <Rss className="w-5 h-5" style={{ color: '#FF6600' }} />
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
